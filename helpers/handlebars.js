module.exports = {
    seleccionarSkills : (seleccionadas = [], opciones) => {

        console.log(seleccionadas);

        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 
        'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 
        'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 
        'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 
        'SQL', 'MVC', 'SASS', 'WordPress'];

        let html= '';
        skills.forEach(skill => {
            html += `
                <li ${seleccionadas.includes(skill) ? ' class="activo"' : ''}>${skill}</li>
            `;
        })

        return opciones.fn().html = html;
    },
    tipoContrato: (seleccionado, opciones) => {
        return opciones.fn(this).replace(
            //cuando encuentre el seleccionado va a agregarle un atributo selected
            new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
        )
    }, //utilizar mensajes de flash en layout
    mostrarAlertas: (errores = {}, alertas) => {
        // alertas es el html llenado en layout, errores lo que se guarda en flash mediante express-validator
        let html = '';

        // filtrar errores uno a uno
        const categoria = Object.keys(errores);
        if(categoria.length) {
            errores[categoria].forEach(error => {
                html += `<div class="${categoria} alerta">
                    ${error}
                </div>`
            })
        }
        return alertas.fn().html = html;
    }
}