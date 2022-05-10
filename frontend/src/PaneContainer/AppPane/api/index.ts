export function api<T>(url: string): Promise<T> {
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        });
}

export const getIsRunning = async (isRunningUrl: string, projectContainerReplicaName: string): Promise<boolean> => {
    return await fetch(`${isRunningUrl}?container_name=${projectContainerReplicaName}`, {})
        .then((response) => {

            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.text().then(text => {
                return text == "true";
            })
        });
}