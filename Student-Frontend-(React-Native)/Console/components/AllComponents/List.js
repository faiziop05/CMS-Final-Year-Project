import { SelectList } from 'react-native-dropdown-select-list';
import React from 'react'

const List = ({defaulvalue,setSelectedValue,dataValue}) => {
    return (
        <SelectList
            defaultOption={defaulvalue}
            setSelected={setSelectedValue}
            data={dataValue}
            save="value"
            boxStyles={{ width: '100%', marginBottom: 10, height: 50, backgroundColor:'#fff',borderColor:'#fff' }}
            dropdownStyles={{ width: '100%', marginBottom: 10,backgroundColor:'#fff',borderColor:'#fff' }}
        />
    )
}

export default List
