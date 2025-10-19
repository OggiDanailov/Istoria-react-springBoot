export const scrollToFormInput = (inputSelector, delay = 0) => {
  setTimeout(() => {
    const input = document.querySelector(inputSelector)
    if (input) {
      input.scrollIntoView({ behavior: 'smooth' })
      input.focus()
    }
  }, delay)
}