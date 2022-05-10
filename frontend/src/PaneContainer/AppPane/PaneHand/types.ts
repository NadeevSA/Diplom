export interface IPanelHand {
    isRunning: boolean
    input: string
    output: string
    // eslint-disable-next-line no-unused-vars
    handleChange: ({value}: {value: string | null}) => void
}