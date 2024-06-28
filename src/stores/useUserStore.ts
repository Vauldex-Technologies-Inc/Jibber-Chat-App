import { ref } from "vue"
import { defineStore } from "pinia"
import type { User } from "@/types/User"
import type { Message } from "@/types/Message"
import { useFetch } from "@/composables/useFetch"
import axios, { AxiosError } from "axios"
import { useDateFormatter } from "@/composables/useDateFormatter"

const dateFormatter = useDateFormatter()

const defaultOptions: Intl.DateTimeFormatOptions = {
	month: "long",
	day: "numeric",
	weekday: "long",
	hour: "numeric",
	minute: "numeric",
	hour12: true,
}

export const useUserStore = defineStore("users", () => {
	const users = ref<User[]>([])

	const onlineUsers = ref<string[]>([])

	const init = async () => {
		try {
			const { data } = await axios.get("/users")
			const result = data.users
			users.value = result
		} catch (e) {
			const error = e as AxiosError
			console.error(error)
		}
	}

	const getUsers = () => {
		return users
	}

	const getUser = (idUser: string) => {
		return users.value.find((user) => user.id == idUser)
	}

	const updateUserOnlineAt = (users: string[], type: string) => {
		if (type === "online") {
			onlineUsers.value = users
		} else {
			onlineUsers.value = [...onlineUsers.value.filter(ol => users.indexOf(ol) === -1)]
		}
	}

	const getOnlineUsers = () => {
		return onlineUsers
	}

	const addNewUser = (user: User) => {
		users.value.push(user)
	}

	const sentAtFormatter = (message: Message, options: Intl.DateTimeFormatOptions = defaultOptions) => {
		return dateFormatter.format(message.sentAt, options)
	}

	const getStatus = (userId?: string) => {
		if (userId && getOnlineUsers().value.includes(userId)) {
			return "online"
		}
		return "offline"
	}

	const inviteMember = async (channelId: string, idSender: string) => {
		try {
			await useFetch(`/channels/${channelId}/invites`, {
				method: "POST",
				body: JSON.stringify({
					userId: idSender,
				}),
			})
		} catch (error) {
			throw new Error(`Error: ${error}`)
		}
	}

	return {
		users, init, getUser, getUsers, getStatus, updateUserOnlineAt, onlineUsers,
		getOnlineUsers, addNewUser, sentAtFormatter, inviteMember
	}
})