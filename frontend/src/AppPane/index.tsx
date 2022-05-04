import React, {FC, useState} from 'react';
import {AttachIntent, IPane, Status} from './types';
import {TextField} from '@consta/uikit/TextField';
import {Button} from '@consta/uikit/Button';
import './index.css';
import {Loader} from "@consta/uikit/Loader";


export const AppPane: FC<IPane> = ({
                                       runUrl,
                                       buildUrl,
                                       attachUrl,
                                       projectId,
                                       currentStatus,
                                       projectName,
                                       statusCheckUrl
                                   }) => {
    const [status, setStatus] = useState(currentStatus);
    const [isWaiting, setWaiting] = useState(false);
    const [input, setInput] = useState<string | null>(null);
    const [output, setOutput] = useState<string | null>(null)
    const handleChange = ({value}: { value: string | null }) => setInput(value);

    const setOutPutClear = () => {
        setOutput("")
    }

    const buildProject = () => {
        setWaiting(true);
        fetch(buildUrl, {
            method: 'POST',
            headers: {
                'id': projectId,
            }
        })
            .then((response) => {
                setWaiting(false);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                setStatus(Status.Build);
            });
    };

    const runProject = () => {
        setWaiting(true);
        fetch(runUrl, {
            method: 'POST',
            headers: {
                'id': projectId,
            }
        })
            .then((response) => {
                setWaiting(false);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                setStatus(Status.Running);
            });
    };

    const attachAttach = () => {
        if (!input) return
        const intent: AttachIntent = {
            Name: projectName,
            Input: input
        }
        fetch(attachUrl, {
            method: 'POST',
            body: JSON.stringify(intent)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                response.text().then(text => {
                    setOutput(text)
                    getStatus()
                })
            });
    }

    const getStatus = () => {
        setWaiting(true)
        fetch(`${statusCheckUrl}?field=id&val=${projectId}`, {})
            .then((response) => {
                setWaiting(false);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                console.log(response)
                response.text().then(text => {
                    setStatus(Number(text))
                })
            });
    }

    const content = () => {
        return (
            <div>
                <div className={"pane"}>
                    <div className={"panel"}>
                        <TextField
                            disabled={status != Status.Running}
                            onChange={handleChange}
                            value={input}
                            type="textarea"
                            cols={200}
                            rows={7}
                            placeholder="Ввод параметров"
                        />
                    </div>
                    <div className={"panel"}>
                        <TextField
                            disabled={status != Status.Running}
                            value={output}
                            type="textarea"
                            cols={200}
                            rows={7}
                            placeholder="Результат"
                        />
                    </div>
                </div>
                <div className={"button_pane"}>
                    <div className={"button_pane_left"}>
                        <Button
                            size='s'
                            label={'Build'}
                            onClick={buildProject}
                            className={"button_action"}/>
                        <Button
                            size='s'
                            label={'Run'}
                            onClick={runProject}
                            disabled={status == Status.Default}
                            className={"button_action"}/>
                        <Button
                            size='s'
                            label={'Attach'}
                            onClick={attachAttach}
                            disabled={status != Status.Running}
                            className={"button_action"}/>
                    </div>
                    <div className={"button_pane_right"}>
                        <Button
                            label={"Clear"}
                            size={'s'}
                            onClick={setOutPutClear}
                            className={"button_action_right"}/>
                    </div>
                </div>
            </div>
        );
    };

    const waiting = () => {
        return (<Loader className={"loader"}/>);
    };
    return isWaiting ? waiting() : content();
};
