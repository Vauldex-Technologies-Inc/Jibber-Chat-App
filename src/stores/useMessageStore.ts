import { ref, computed } from "vue"

import { defineStore } from "pinia"

import { useFetch } from "@/composables/useFetch"

import { MessageSchema, type Message } from "@/types/Message"
import axios from "axios"

export const useMessageStore = defineStore("messages", () => {
	const latestMessages = ref<Array<Message>>([])
	const _messages = ref<Array<Message>>([])

	const chatImages = computed(() => {
		return _messages.value.map((m: Message) => m.image ? m.image : "")
	})

	const chatMessages = computed(() => {
		return _messages.value
	})

	const init = async () => {
		try {
			const {data} = await axios.get("/channels/latest-messages")
			const validation = MessageSchema.array().safeParse(data.filter((d: Message) => d !== null))
			if (validation.success) {
				latestMessages.value = validation.data
			} else {
				throw new Error("Unsupported Format")
			}

		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
			}
		}
	}

	const getChannelMessages = async (idChannel: string) => {
		const res = await useFetch(`/channels/${idChannel}/messages`)

		_messages.value = (await res.json()).messages
	}

	const sendMessage = async (idChannel: string, message: string, img: string | undefined) => {
		try {
			const { data } = await axios.post(`/channels/${idChannel}/messages`, { 
				text: message,
				image: img 
			})
			const messageValidation = MessageSchema.safeParse(data.messages)

			if (messageValidation.success) {
				latestMessages.value.push(messageValidation.data)
			} else {
				throw new Error("Unknown Format")
			}
		} catch (error) {
			error instanceof Error ? console.error(error.message) : ""
		}
	}

	const addNewLatestMessage = (message: Message) => {
		latestMessages.value.push(message)
	}

	const getLatestMessages = () => {
		return latestMessages
	}

	return {
		getChannelMessages,
		sendMessage,
		latestMessages,
		chatImages,
		chatMessages,
		init,
		getLatestMessages,
		addNewLatestMessage
	}
})