import React, {FC, useEffect, useState} from "react";
import {IPanelFile} from "./types";
import {TextField} from "@consta/uikit/TextField";

import './index.css';
import {Select} from "@consta/uikit/Select";

export const PanelFile: FC<IPanelFile> = ({output, dataFile, onSetDataFile,dataFiles, fileContentUrl}) => {
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
            <Select
                className={"select"}
                size={"xs"}
                placeholder="Выберите значение"
                items={dataFiles}
                value={dataFile}
                onChange={(item) => {if(item.value) onSetDataFile(item.value)}}
                getItemLabel={(item) => item.Label}
                getItemKey={(item) => item.ID}
            />
            <div className={"texts"}>
                <TextField
                    className={"panel_file"}
                    disabled={true}
                    value={inputFileText}
                    type="textarea"
                    cols={200}
                    rows={7}
                />
                <TextField
                    className={"panel_file"}
                    disabled={true}
                    value={output}
                    type="textarea"
                    cols={200}
                    rows={7}
                    placeholder="Результат"
                />
            </div>
        </div>)
}

