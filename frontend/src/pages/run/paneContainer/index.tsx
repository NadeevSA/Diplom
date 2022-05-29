import { AppPane } from './appPane';
import './index.css';

export const AppContent = () => {

    const buildUrl ='http://localhost:8084/builder/build'
    const dataFileUrl = "http://localhost:8084/data"
    const runUrl = 'http://localhost:8084/builder/run'
    const attachUrl = "http://localhost:8084/builder/attach"
    const attachFileUrl = "http://localhost:8084/builder/attach/data"
    const statusCheckUrl = "http://localhost:8084/builder/status"
    const fileContentUrl = "http://localhost:8084/data/content"
    const isRunningUrl = "http://localhost:8084/builder/is_running"
    const projectConfigUrl = "http://localhost:8084/project_config"

    {return <AppPane buildUrl={buildUrl}
                            projectConfigUrl={projectConfigUrl}
                            dataFileUrl={dataFileUrl}
                            runUrl={runUrl}
                            attachUrl={attachUrl}
                            attachUrlFileUrl={attachFileUrl}
                            statusCheckUrl={statusCheckUrl}
                            fileContentUrl={fileContentUrl}
                            isRunningUrl={isRunningUrl}
                    />}
};