import React, {FC} from "react";
import {IPanelHand} from "./types";
import {TextField} from "@consta/uikit/TextField";
import './index.css';

export const PanelHand: FC<IPanelHand> = ({input, isRunning, output, handleChange}) => {
    return (<div className={"pane_hand"}>
        <TextField
            className={"panel_hand"}
            disabled={!isRunning}
            onChange={handleChange}
            value={input}
            type="textarea"
            cols={200}
            rows={7}
            placeholder="Ввод параметров"
        />

        <TextField
            className={"panel_hand"}
            disabled={false}
            value={output}
            type="textarea"
            cols={200}
            rows={7}
            placeholder="Результат"
        />

    </div>)
}