import { body } from 'express-validator';

const registerTrainingValidationRules = () =>{
    return [
        body('type')
       .notEmpty().withMessage('El typo es requerido')
       .custom(value => {
         if (!isNaN(value)) {
           throw new Error('El tipo no puede ser numérico');
         }
         return true;
       }),
       body('date')
       .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('El formato de la edad debe ser AAAA-MM-DD')
       .notEmpty().withMessage('La fecha es requerida'),
       body("location")
       .custom(value => {
        if (!isNaN(value)) {
          throw new Error('El tipo no puede ser numérico');
        }
        return true;
        }),
        body('description')
        .notEmpty().withMessage('La descripción es requerida'),
        body('image')
        .custom(value => {
            if (!isNaN(value)) {
              throw new Error('El tipo no puede ser numérico');
            }
            return true;
            }),
    ]

}


export { registerTrainingValidationRules };