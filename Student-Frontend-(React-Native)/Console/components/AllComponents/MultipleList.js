import { MultipleSelectList } from 'react-native-dropdown-select-list';
import React from 'react';

const MultipleList = ({ setSelectedValue, dataValue }) => {
  return (
    <MultipleSelectList
      setSelected={setSelectedValue}  
      data={dataValue}
      save="key"  // Ensure we're saving the key
      boxStyles={{ width: '100%', marginBottom: 10, height: 50, backgroundColor:'#fff', borderColor:'#fff' }}
      dropdownStyles={{ width: '100%', marginBottom: 10, backgroundColor:'#fff', borderColor:'#fff' }}
    />
  );
}

export default MultipleList;
