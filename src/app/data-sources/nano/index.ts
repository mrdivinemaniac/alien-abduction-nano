const URL = 'wss://ws.mynano.ninja/'

export type ConfirmationDataT = {
  account: string,
  amount: string,
  type: 'send' | 'receive',
  blockHash: string
}

export class NanoDataSource {
  socket: WebSocket
  confirmationCallback: (data: ConfirmationDataT) => any

  constructor () {
    this.handleSocketMessage = this.handleSocketMessage.bind(this)
    this.subscribeToConfirmations = this.subscribeToConfirmations.bind(this)
    this.initializeSocket(URL)
      .then(this.subscribeToConfirmations)
  }

  private initializeSocket (url: string): Promise<WebSocket> {
    const socket = new WebSocket(url)
    return new Promise((resolve, reject) => {
      socket.onopen = () => {
        console.info(`Connection established with ${url}`)
        this.socket = socket
        resolve(socket)
      }
      socket.onerror = reject
    })
  }

  private subscribeToConfirmations () {
    this.socket.send(JSON.stringify({
      action: 'subscribe',
      topic: 'confirmation',
      ack: true
    }))
    this.socket.onmessage = this.handleSocketMessage
  }

  private handleSocketMessage (event: MessageEvent) {
    if (this.confirmationCallback) {
      const data = JSON.parse(event.data)
      if (data.topic != 'confirmation') return
      const message = data.message
      this.confirmationCallback({
        account: message.account,
        amount: message.amount,
        type: message.block.subtype,
        blockHash: message.hash
      })
    }
  }

  onConfirmation (cb: (data: ConfirmationDataT) => any) {
    this.confirmationCallback = cb
  }
}
