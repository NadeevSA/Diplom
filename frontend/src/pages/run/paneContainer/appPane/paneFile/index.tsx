import React, {FC, useEffect, useState} from "react";
import {IPanelFile} from "./types";
import {TextField} from "@consta/uikit/TextField";
import './index.css';
import {Select} from "@consta/uikit/Select";

export const PanelFile: FC<IPanelFile> = ({output, dataFile, fileContentUrl}) => {
    const [inputFileText,setInputFileText] = useState<string>("")

    const getFileContent = (id: number) => {
        return fetch(`${fileContentUrl}?id=${id}`)
    }

    useEffect(()=>{
        if (dataFile) {
            getFileContent(dataFile.ID)
                .then(r => {
                    if (r.ok) {
                        r.text()
                            .then(t => setInputFileText(t))
                    }
                })
        }
    },[dataFile])

    return (
        <div className={"pane_file"}>
            <div className={"texts"}>
                <TextField
                    className={"panel_file"}
                    value={inputFileText}
                    type="textarea"
                    cols={200}
                    rows={25}
                />
                <TextField
                    className={"panel_file"}
                    disabled={false}
                    value={output}
                    type="textarea"
                    cols={200}
                    rows={25}
                    placeholder="Результат"
                />
            </div>
        </div>)
}

