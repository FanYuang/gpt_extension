import {
    initializeBlock,
    useBase,
    useRecords,
    updateRecordAsync ,
    Button,
    Input
} from '@airtable/blocks/ui';

const axios = require('axios');

import React , { useState } from 'react';



function TodoExtension() {
    const [apiKey, setApiKey] = useState('');
    const base = useBase();
    const table = base.getTableByName('Tasks');
    const records = useRecords(table);
    const prompt = table.getFieldByName('prompt');
    const role = table.getFieldByName('role');
   
    async function updateresult()
    {
 
       for (let record of records)
       {
        let p_value = record.getCellValue(prompt);
        //let r_value = record.getCellValue(role);
        //console.log(typeof(p_value),typeof(r_value));
        await axios.post('https://api.openai.com/v1/chat/completions',{ 
            "model": "gpt-3.5-turbo",
            "messages": [{"role":"You are a helpful assistant.", "content": p_value}]},
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