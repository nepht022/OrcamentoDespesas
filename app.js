class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == '' || this[i] == undefined || this[i] == null){
                return false
            }else{
                return true
            }
        }
    }
}

class Bd{
    constructor(){
        let id = localStorage.getItem('id')
        if(id===null){
            localStorage.setItem('id', 0)
        }
    }
    getProxId(){
        let proxId = localStorage.getItem('id')
        return parseInt(proxId)+1
    }

    gravar(d){
        let id = this.getProxId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        let arrayDespesas = Array()

        let id = localStorage.getItem('id')
        for(let i=1; i<=id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa===null){
                continue
            }
            despesa.id = i
            arrayDespesas.push(despesa)
        }
        return arrayDespesas
    }

    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}
let bd = new Bd()

function cadastrarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    if(despesa.validarDados()){
        document.getElementById('modal_titulo').innerHTML = 'Dados gravados com sucesso!'
        document.getElementById('modal_title_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa cadastrada com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'
        bd.gravar(despesa)
        $('#modalRegistraDespesa').modal('show')

        document.getElementById('ano').value = ''
        document.getElementById('mes').value = ''
        document.getElementById('dia').value = ''
        document.getElementById('tipo').value = ''
        document.getElementById('descricao').value = ''
        document.getElementById('valor').value = ''
    }else{
        document.getElementById('modal_titulo').innerHTML = 'Dados inválidos!'
        document.getElementById('modal_title_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa inválida!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'
        $('#modalRegistraDespesa').modal('show')
    }   
}

function carregaListaDespesas(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro==false){
        despesas = bd.recuperarTodosRegistros()
    }
    //recupera o body
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d){
        //adiciona linha
        let linha = listaDespesas.insertRow()
        //adiciona coluna
        linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        
        //criando botao de exclusao
        let btn = document.createElement('button')
        btn.id = ('id_despesa_'+d.id)
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}

function pesquisarDespesas(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    
    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let despesasFiltradas = bd.pesquisar(despesa)
    carregaListaDespesas(despesasFiltradas, true)
}

