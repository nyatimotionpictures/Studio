import React from 'react'

const SearchInput = ({
    value: initValue,onChange,
    debounce = 500,
    ...props
}) => {
    const [value, setValue] = React.useState(initValue);

    React.useEffect(() => {
        setValue(initValue)
    }, [initValue])
    
// * 0.5s after set value in state
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)
        
        return () => clearTimeout(timeout)
    },[value])
  return (
      <input {...props} value={value} onChange={(e)=> setValue(e.target.value)} />
  )
}

export default SearchInput