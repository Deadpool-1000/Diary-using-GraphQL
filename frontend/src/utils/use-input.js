import { useState } from 'react';


const useInput = (validator) => {
    const [ value, setValue ] = useState('');
    const [ isTouched, setIsTouched ] = useState(false);

    function changeHandler(event){
        setValue(event.target.value);
    }
    function blurHandler(event){
        setIsTouched(true);
    }

    const isValid = validator(value);
    const isInvalid = !isValid && isTouched;

    function reset() {
        setIsTouched(false);
        setValue('');
    }

    return {
        value,
        isValid,
        isInvalid,
        changeHandler,
        blurHandler,
        reset
    }
}

export default useInput;