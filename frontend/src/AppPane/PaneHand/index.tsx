import React, {FC} from "react";
import {IPanelHand} from "./types";
import {TextField} from "@consta/uikit/TextField";
import {Status} from "../types";
import './index.css';

export const PanelHand: FC<IPanelHand> = ({input, status, output, handleChange}) => {
    return (
        <div className={"pane_hand"}>
            <TextField
                className={"panel_hand"}
                disabled={status !== Status.Running}
                onChange={handleChange}
                value={input}
                type="textarea"
                cols={200}
                rows={7}
                placeholder="Ввод параметров"
            />

            <TextField
                className={"panel_hand"}
                disabled={true}
                value={output}
                type="textarea"
                cols={200}
                rows={7}
                placeholder="Результат"
            />

        </div>)
}