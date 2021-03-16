const URL = 'wss://ws.mynano.ninja/'

export type ConfirmationDataT = {
  account: string,
  amount: string,
  type: 'send' | 'receive',
  blockHash: string
}

export class NanoDataSource {
  socket: WebSocket
  private errorCb: (e: Error) => any
  private confirmationCallback: (data: ConfirmationDataT) => any

  constructor () {
    this.handleSocketMessage = this.handleSocketMessage.bind(this)
    this.subscribeToConfirmations = this.subscribeToConfirmations.bind(this)
  }

  async connect () {
    try {
      await this.initializeSocket(URL)
      return this.subscribeToConfirmations()
    } catch (e) {
      if (this.errorCb) this.errorCb(e)
    }
  }

  private initializeSocket (url: string): Promise<WebSocket> {
    console.info(`Connecting to ${url}`)
    const socket = new WebSocket(url)
    return new Promise((resolve, reject) => {
      socket.onopen = () => {
        console.info(`Connection established to ${url}`)
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

  onError (cb: (e: Error) => any) {
    this.errorCb = cb
  }

  onConfirmation (cb: (data: ConfirmationDataT) => any) {
    this.confirmationCallback = cb
  }
}
