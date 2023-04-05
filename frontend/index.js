import {
    initializeBlock,
    useBase,
    useRecords,
    useLoadable, useWatchable,useCursor,useRecordById,
    Button,
    Input
} from '@airtable/blocks/ui';

const axios = require('axios');

import React , { useState } from 'react';
function RecordListItem({table, recordId}) {
    let record = useRecordById(table, recordId);
    return record;
}


function TodoExtension() {
    const [apiKey, setApiKey] = useState('');
    const cursor = useCursor();
    const base = useBase();
    const table = base.getTableByName('Tasks');
    const queryResult = table.selectRecords();
    queryResult.loadDataAsync();
    const prompt = table.getFieldByName('prompt');
   
   
     // load selected records
    useLoadable(cursor);
     // re-render whenever the list of selected records changes
    //useWatchable(cursor, ['selectedRecordIds']);
     // render the list of selected record ids
   
    //console.log(cursor);


    async function updateresult()
    {
       
       for (let id of cursor.selectedRecordIds)
       {
     
        let record = queryResult.getRecordById(id);
      
        let p_value = record.getCellValue(prompt);
     
        await axios.post('https://api.openai.com/v1/chat/completions',
        { 
            "model": "gpt-3.5-turbo",
            "messages": [{"role":"assistant", "content": p_value}]},
        {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        
        }).then((res) => {
            console.log(res);
            table.updateRecordAsync(record, {'result': res.data.choices[0].message.content});
        }).catch(error => console.log(error));
        
        
    }
    }
    return (
        <div>
            <Input type="text" placeholder="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            <Button onClick={() => updateresult()} icon="edit">
                Button
            </Button>
        </div>
    );
}
initializeBlock(() => <TodoExtension />);