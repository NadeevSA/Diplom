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
            rows={20}
            size="l"
            placeholder="Ввод параметров"
        />

        <TextField
            className={"panel_hand"}
            disabled={true}
            value={output}
            type="textarea"
            size="l"
            cols={200}
            rows={20}
            placeholder="Результат"
        />

    </div>)
}