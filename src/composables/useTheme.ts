type Theme = "dark" | "light"
import {ref} from "vue"

const curTheme = ref<Theme>("light")


export const useTheme = () => {

	const init = () => {
		const theme = localStorage.getItem("theme")
		if(theme) {
			setTheme(theme)
		} else {
			setTheme("light")
		}
	}

	const getTheme = () => {
		return curTheme
	}

	const setTheme = (theme: Theme) => {
		if(theme === "dark"){
			document.body.classList.remove("light")
			document.body.classList.add(theme)
		} else {
			document.body.classList.remove("dark")
			document.body.classList.add(theme)
		}
		
		curTheme.value = theme
		console.log(curTheme.value)
		localStorage.setItem("theme",theme)
	}


	return {setTheme,init,getTheme}
}