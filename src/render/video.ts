import xCloudPlayer from '../player'

export default class VideoComponent {
    private _player:xCloudPlayer

    private _element:HTMLVideoElement | undefined

    constructor(player:any){
        this._player = player
    }

    create(stream:MediaStream) {
        const videoElement = document.createElement('video')
        videoElement.srcObject = stream
        videoElement.autoplay = true
        videoElement.muted = true
        videoElement.playsInline = true
        videoElement.style.width = '100%'
        videoElement.style.height = '100%'
        videoElement.style.objectFit = 'contain'
        videoElement.style.backgroundColor = 'black'
        videoElement.style.touchAction = 'none'

        const element = document.getElementById(this._player.getElementId())
        if(element === null) {return}

        this._element = videoElement
        element.appendChild(this._element)

        this._element.requestVideoFrameCallback(this.processVideoMetadata.bind(this))
    }

    processVideoMetadata(timestamp, data:VideoFrameCallbackMetadata) {
        if(this._element === undefined) {return}

        this._element.requestVideoFrameCallback(this.processVideoMetadata.bind(this))

        this._player._channels.input.queueMetadataFrame({
            serverDataKey: data.rtpTimestamp as number,
            firstFramePacketArrivalTimeMs: data.receiveTime as number,
            frameSubmittedTimeMs: data.receiveTime as number,
            frameDecodedTimeMs: data.expectedDisplayTime,
            frameRenderedTimeMs: data.expectedDisplayTime,
        })
    }

    getElement(){
        return this._element
    }

    destroy(){
        const streamHolder = document.getElementById(this._player.getElementId())
        const element = streamHolder?.querySelector('video')

        if(element){
            element.remove()
        }
    }
}