import { Column } from "@consta/charts/Column";
import { Button } from "@consta/uikit/Button";
import { Card } from "@consta/uikit/Card";
import { useState } from "react";
import ApiTimeProjectData, { TimeProjectData } from "../../api/ApiTimeProjectData";

export const Chart = () => {
    const [value, setValue] = useState<TimeProjectData[]>([]);
    
    function getDataForChart() {
        ApiTimeProjectData.getAll().then(res => {
          debugger;
          setValue(res.data); 
        });
    }
    
    return(
        <Card>
            <Button view="secondary" label="Применить" onClick={getDataForChart}/> 
            <Column
              data={value}
              xField="projectId"
              yField="dataId"
              seriesField="duration"
              isGroup
              slider={{
                start: 0,
                end: 1,
              }}
              autoFit={false}
              label={{
                position: 'middle',
                layout: [
                  { type: 'interval-adjust-position' },
                  { type: 'interval-hide-overlap' },
                  { type: 'adjust-color' },
                ],
              }}/>
        </Card>)
}