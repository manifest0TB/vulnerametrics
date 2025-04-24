import { defineStore } from 'pinia'

interface Notification {
  id: number
  message: string
  type: 'error' | 'success'
  duration?: number
}

interface NotificationState {
  notifications: Notification[]
  nextId: number
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
    nextId: 1
  }),

  actions: {
    addNotification(message: string, type: 'error' | 'success', duration: number = 5000) {
      const notification: Notification = {
        id: this.nextId++,
        message,
        type,
        duration
      }
      this.notifications.push(notification)
    },

    removeNotification(id: number) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },

    showError(message: string, duration?: number) {
      this.addNotification(message, 'error', duration)
    },

    showSuccess(message: string, duration?: number) {
      this.addNotification(message, 'success', duration)
    }
  }
}) 