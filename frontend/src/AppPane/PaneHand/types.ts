import {Status} from "../types";

export interface IPanelHand {
    status: Status
    input: string
    output: string
    // eslint-disable-next-line no-unused-vars
    handleChange: ({value}: {value: string | null}) => void
}