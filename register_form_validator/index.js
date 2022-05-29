function Validator (formSelector, options) {

    if (!options) {
        options = {}
    }

    function getParent (element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    let formRules = {}

    let validatorRules = {
        required(value) {
            return value ? undefined : 'Vui lòng nhập trường này'
        },

        email(value) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập đúng email'
        },

        min(min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`
            }
        },

        checkpass(pass) {
            return function (value) {
                return value === pass.value ? undefined : 'Không trùng mật khẩu, vui lòng nhập lại'
            }
        }
    }

    let formElement = document.querySelector(formSelector)

    if(formElement) {
        let inputs = formElement.querySelectorAll('[name][rules]')

        for(let input of inputs) {
            let ruleNames = input.getAttribute('rules').split('|')
            
            for(let ruleName of ruleNames) {
                let isRuleNameHasValue = ruleName.includes(':')
                let ruleInfo

                if(isRuleNameHasValue) {
                    ruleInfo = ruleName.split(':')
                    ruleName = ruleInfo[0]
                }

                let ruleFunc = validatorRules[ruleName]

                if(isRuleNameHasValue) {
                    if(ruleInfo[1] === 'passvalue') {
                        ruleInfo[1] = formElement.querySelector('#password')
                    }
                    ruleFunc = ruleFunc(ruleInfo[1])                    
                }

                if(Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc]
                }
            }

            input.onblur = handleValidate
            input.oninput = handleClearError
        }

        function handleValidate(e) {
            let rules = formRules[e.target.name]
            let errorMessage

            for(let rule of rules) {
                errorMessage = rule(e.target.value)
                if(errorMessage) break
            }

            if(errorMessage) {
                let formGroup = getParent(e.target, '.form-group')
    
                if(formGroup) {
                    formGroup.classList.add('invalid')
                    let formMessage = formGroup.querySelector('.form-message')
                    if(formMessage){
                        formMessage.innerText = errorMessage
                    }                    
                }
            }
            return !errorMessage
        }

        function handleClearError(e) {
            let formGroup = getParent(e.target, '.form-group')
            if(formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid')

                let formMessage = formGroup.querySelector('.form-message')
                if(formMessage) {
                    formMessage.innerText = ''
                }
            }
        }

        formElement.onsubmit = function (e) {
            e.preventDefault()

            let inputs = formElement.querySelectorAll('[name][rules]')
            let isValid = true

            for(let input of inputs) {
                if(!handleValidate({target: input,})) {
                    isValid = false
                }
            }

            if(isValid) {
                if(typeof options.onSubmit === 'function') {
                    let enableInputs = formElement.querySelectorAll('[name]')
                    let data = Array.from(enableInputs).reduce(function(values, input) {
                        switch (input.type) {
                            default:
                                values[input.name] = input.value
                        }
                        return values
                    }, {})
                    options.onSubmit(data)
                } else {
                    formElement.submit();
                }
            }
        }
    }
}