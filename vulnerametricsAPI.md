# Documentation

## API Name: VulnerametricsAPI

* **Type:** AWS API Gateway REST API
* **Purpose:** To securely expose backend Lambda functions for the Vulnerametrics frontend application, enabling users to check credits, retrieve CVE information, and generate AI-powered vulnerability reports.
* **Deployment Stage:** `prod`
* **Base Invoke URL:** `https://wg77sau8q5.execute-api.us-east-1.amazonaws.com/prod`

### Authentication

All endpoints are protected using the 'VulnerametricsCognitoAuthorizer', which validates a Cognito User Pool ID Token. Every request MUST include an 'Authorization' header with the value `Bearer <Cognito_ID_Token>`, where `<Cognito_ID_Token>` is the valid ID token obtained after successful user authentication via the `VulnerametricsUserPool`.

### CORS

Cross-Origin Resource Sharing (CORS) is enabled for the origin `https://vulnerametrics.com`. It permits GET and POST methods (as applicable per endpoint), allows the `Authorization` header, and allows credentials. Preflight OPTIONS requests are handled automatically by API Gateway or explicitly in the Lambda functions.

### Lambda Integration

All endpoints use Lambda Proxy integration, meaning the request details are passed directly to the backend Lambda function, and the function's response (including status code, headers, and body) is returned directly to the client.

---

## Endpoints

---

### Endpoint: `GET /credits/check`

* **Description:** Retrieves the current credit balance for the authenticated user.
* **Method:** `GET`
* **Path:** `/credits/check`
* **Request:**
    * **Headers:**
        * `Authorization`: `Bearer <Cognito_ID_Token>` (**Required**)
    * **Body:** None

* **Successful Response (200 OK):**
    * `Content-Type`: `application/json`
    * **Body:** A JSON object containing the user's current credit balance.
        ```json
        {
          "creditBalance": 3
        }
        ```

* **Error Responses:**
    * `401 Unauthorized`: Missing or invalid ID token provided in the Authorization header.
    * `403 Forbidden`: User identifier (e.g., Cognito 'sub') could not be found in the request context provided by the authorizer.
    * `500 Internal Server Error`: Backend error retrieving credits (e.g., issue with Lambda function 'VulnerametricsCheckCreditsFunction' or DynamoDB 'UserCreditsVulnerametrics' table access).

---

### Endpoint: `GET /cve/{id}`

* **Description:** Fetches publicly available details for a specific CVE (Common Vulnerabilities and Exposures) identifier directly from the National Vulnerability Database (NVD). This operation does not consume user credits.
* **Method:** `GET`
* **Path:** `/cve/{id}`
* **Path Parameters:**
    * `id` (**String, Required**): The CVE identifier to retrieve information for (e.g., "CVE-2024-1234"). Format must match standard CVE pattern.
* **Request:**
    * **Headers:**
        * `Authorization`: `Bearer <Cognito_ID_Token>` (**Required**)
    * **Body:** None

* **Successful Response (200 OK):**
    * `Content-Type`: `application/json`
    * **Body:** The raw JSON object representing the CVE details as retrieved directly from the NVD API v2.0 (specifically, the `.vulnerabilities[0].cve` object from the NVD response). The structure includes description, publication dates, CVSS metrics (v3.x and potentially others if present in NVD data), weaknesses (CWEs), configurations (CPEs), references, etc.

* **Error Responses:**
    * `400 Bad Request`: Invalid CVE ID format provided in the path parameter.
    * `401 Unauthorized`: Missing or invalid ID token.
    * `404 Not Found`: The specified CVE ID was not found in the NVD database.
    * `500 Internal Server Error`: Backend error (e.g., issue with Lambda function 'VulnerametricsGetCveFunction' accessing Secrets Manager for NVD API key).
    * `502 Bad Gateway`: Error communicating with or receiving a valid response from the NVD API (e.g., NVD server error, invalid API key response, rate limiting). The Lambda function may return this status for NVD issues other than a clean 404.

---

### Endpoint: `POST /report/{id}`

* **Description:** Initiates the generation of a detailed, AI-enhanced PDF report for the specified CVE ID using AI analysis. This operation requires the authenticated user to have a credit balance greater than zero and will consume one credit upon successful initiation. The response contains the S3 object key for the generated report.
* **Method:** `POST`
* **Path:** `/report/{id}`
* **Path Parameters:**
    * `id` (**String, Required**): The CVE identifier for which to generate the report (e.g., "CVE-2024-1234"). Format must match standard CVE pattern.
* **Request:**
    * **Headers:**
        * `Authorization`: `Bearer <Cognito_ID_Token>` (**Required**)
    * **Body:** None

* **Successful Response (200 OK):**
    * `Content-Type`: `application/json`
    * **Body:** A JSON object confirming successful report generation and providing the S3 key to access it.
        ```json
        {
          "message": "Report generated successfully.",
          "reportKey": "generated-reports/CVE-2024-1234-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-1678886400000.pdf",
          "cveId": "CVE-2024-1234",
          "timestamp": "2025-04-24T18:00:00.000Z"
        }
        ```
    * **Note on Handling the Response (`reportKey`):**
        The PDF report is stored in the private S3 bucket `vulnerametrics-reports-pdf`. The `reportKey` returned by the API is the unique identifier (path and filename) of the PDF object within that bucket. Because the bucket is private, this key alone cannot be used as a direct download link.
        The frontend application MUST use this `reportKey` to generate a temporary, secure download link for the user. This is achieved by generating an S3 Pre-Signed URL.
        Using the AWS Amplify library (Storage category) in the frontend is the recommended approach. After receiving the successful API response containing the `reportKey`, the frontend should call a function conceptually similar to `Storage.get(reportKey, { expires: 300, download: true })`.
        This Amplify function leverages the authenticated user's temporary AWS credentials (obtained via Cognito Identity Pool) to request the pre-signed URL from S3. This requires the user's IAM role (`cognito_IAM_role_vulnerametrics`) to have the `s3:GetObject` permission on the `vulnerametrics-reports-pdf` bucket (potentially restricted to objects matching the user's identity).
        The resulting pre-signed URL can then be used as the `href` in a download link presented to the user. The URL will expire after the specified time (e.g., 300 seconds).

* **Error Responses:**
    * `400 Bad Request`: Invalid CVE ID format provided in the path parameter.
    * `401 Unauthorized`: Missing or invalid ID token.
    * `402 Payment Required`: The authenticated user does not have sufficient credits (credit_balance is 0 or less).
    * `404 Not Found`: The specified CVE ID was not found in the NVD (checked before report generation).
    * `409 Conflict`: Credit decrement failed due to a conflict, potentially because the credit balance changed during processing or was already zero upon the final check before decrementing. The user was not charged.
    * `500 Internal Server Error`: Generic backend error during the report generation process (e.g., Lambda issue, DynamoDB error, Bedrock invocation error, PDF generation failure, S3 upload failure).
    * `502 Bad Gateway`: Error communicating with the NVD API during the data fetching stage.

---

## Security Implementation

The Vulnerametrics API (`VulnerametricsAPI`) incorporates several security measures to protect backend resources and ensure data integrity:

### Authentication

* **Mechanism:** All API endpoints (`/credits/check`, `/cve/{id}`, `/report/{id}`) are secured using an AWS API Gateway Cognito User Pool Authorizer (`VulnerametricsCognitoAuthorizer`).
* **Requirement:** Every request to these endpoints must include a valid `Authorization` header containing a `Bearer <Cognito_ID_Token>`. The ID Token is issued by the `VulnerametricsUserPool` upon successful user login.
* **Enforcement:** API Gateway, using the configured authorizer, validates the signature, expiration, issuer, and audience of the provided ID Token before allowing the request to proceed to the backend Lambda function. Requests lacking a valid token are rejected with a `401 Unauthorized` status code.

### Authorization

* **User-Level Access:** Only authenticated users who possess a valid ID Token from the `VulnerametricsUserPool` can invoke the API endpoints.
* **Resource Access:** Authorization for accessing specific AWS resources (DynamoDB tables, Secrets Manager, Bedrock, S3) is handled by the specific IAM execution roles attached to each backend Lambda function. These roles adhere to the principle of least privilege.
* **Application Logic:** Specific authorization checks are performed within the Lambda functions:
    * The `VulnerametricsGenerateReportFunction` verifies the user has sufficient credits (`credit_balance > 0`) in the `UserCreditsVulnerametrics` DynamoDB table before proceeding and consuming a credit.
    * User context (UserID derived from the `sub` claim in the validated ID Token) is used to query and update user-specific data (e.g., credits).
    * S3 object keys for generated reports include the UserID, enabling potential future fine-grained access control (currently requires `s3:GetObject` permission via the authenticated user's Cognito Identity Pool role `cognito_IAM_role_vulnerametrics`).

### Transport Security

* **Encryption:** All communication with the API Gateway endpoints is enforced over HTTPS, ensuring data is encrypted in transit. AWS manages the TLS certificates via ACM for the API Gateway default endpoint and the custom domain associated with Amplify Hosting.

### Data Validation

* **Input Sanitization:** Path parameters, specifically the `{id}` for CVE lookups and report generation, are validated within the respective Lambda functions (`VulnerametricsGetCveFunction`, `VulnerametricsGenerateReportFunction`) against a regular expression (`^CVE-\d{4}-\d{4,}$/i`) to ensure a basic valid format before further processing or querying external services. Invalid formats result in a `400 Bad Request` response.

### Resource Security

* **Private Resources:** Backend resources like the `UserCreditsVulnerametrics` DynamoDB table and the `vulnerametrics-reports-pdf` S3 bucket are configured as private and are not directly accessible from the public internet. Access is controlled via IAM roles.
* **Secrets Management:** Sensitive information, such as the NVD API key, is stored securely in AWS Secrets Manager (`VulnerametricsNvdApiKey`) and accessed only by the authorized Lambda function (`VulnerametricsGetCveFunction`) via its execution role.

### Cross-Origin Resource Sharing (CORS)

* **Configuration:** CORS headers are configured at the API Gateway level to allow requests specifically from the frontend application's origin (`https://vulnerametrics.com`), permit necessary headers like `Authorization`, and allow credentials to be sent.

### API Key Usage

This API does not utilize API Gateway API Keys for authentication or authorization purposes. Access control is managed exclusively through the Cognito User Pool Authorizer (`VulnerametricsCognitoAuthorizer`). Authentication relies solely on the validation of the JSON Web Token (JWT) ID Token provided as a Bearer token in the `Authorization` header of each request. This approach ensures that API access is directly tied to authenticated user sessions managed by AWS Cognito.

### Additional Protections (Built-in)

* **API Gateway Features:** The service provides inherent protection against certain types of DDoS attacks and manages request throttling.
* *(Note: AWS WAF was configurate in Phase 6 to provide further protection against common web exploits like SQL injection, XSS, and malicious bots, and to enable rate-based rules).*
