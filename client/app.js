window.onload = () => {
    const messagesList = document.getElementById('messagesList')
    const socketStatus = document.getElementById('socketStatus')
    const btn = document.getElementById('btn')

    const socket = new WebSocket('ws://localhost:8080')

    socket.onopen = (e) => {
        socketStatus.innerHTML = `Connected to: ${ e.currentTarget.url }`
    }

    socket.onerror = (err) => {
        console.log('WebSocket Error: ', err)
    }

    const currencyRounder = num => {
        return Math.round(num * 1e2) / 1e2
    }

    socket.onmessage = (e) => {
        let data = JSON.parse(e.data)
        messagesList.innerHTML = `
            <li>
                <span>Timestamp: ${data.momentTime}</span>
                <span>Last Ethereum Trade Price: $${ currencyRounder(data.lastEthPrice) }</span>
                <span>Converted USD is $${ currencyRounder(data.priceUsd * data.lastEthPrice) }</span>
            </li>
        ` + messagesList.innerHTML
    }

    socket.onclose = (e) => {
        socketStatus.innerHTML = "Disconnected from WebSocket."
    }

    btn.onclick = (e) => {
        e.preventDefault()
        socket.close()
    }
}