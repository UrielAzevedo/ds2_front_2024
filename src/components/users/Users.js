import React, { Component } from 'react'
import Navbar from '../navbar/Navbar';
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import DataTable from 'react-data-table-component';

class Users extends Component {
  
    state = {
        users: [],
        filteredData: [],
        checkboxChangePassword: true,
        checkboxNotifyEmail: true,
        completeName: '',
        login: '',
        email: '',
        password: '',
        passwordConfirm: '',
        filterText: '',
    }

    columns = [
        {
          name: 'Nome',
          selector: user => user.nomeCompleto,
          sortable: true,
          width: '35%'
        },{
            name: 'Matrícula',
            selector: user => user.matricula,
            sortable: true,
             width: '15%'
          },
        {
          name: 'Email',
          selector: user => user.email,
          sortable: true,
           width: '25%'
        },
        {
            name: 'Role',
            selector: user => user.role,
            sortable: true,
             width: '15%'
          },
        {
            name: 'Ações',
            cell: user => <>
                <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Visualizar Instituto"><i className="bi bi-eye"></i></button>
                <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Editar Instituto"><i className="bi bi-pencil"></i></button>
                <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Excluir selecionado"><i className="bi bi-trash"></i></button>
            </>,
             width: '10%'
        }
    ];

    tableStyle = {
        headCells: {
            style: {
            backgroundColor: 'black',  // Cor de fundo preta
            color: 'white',            // Cor do texto branca para contraste
            fontWeight: 'bold',        // Deixar o texto em negrito
            fontSize: '1.5em',         // Tamanho da fonte
            },
        },
    };

    handleCheckboxChange = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    applyFilters = () => {
        this.setState((prevState) => ({
            filteredData: prevState.users.filter((user) => {
                return (
                    prevState.filterText === '' || user.nomeCompleto.toLowerCase().includes(prevState.filterText.toLowerCase()) ||
                    user.matricula.toLowerCase().includes(prevState.filterText.toLowerCase()) ||
                    user.email.toLowerCase().includes(prevState.filterText.toLowerCase()) ||
                    user.role.toLowerCase().includes(prevState.filterText.toLowerCase())
                );
            })
        }));
    }

    handleChange = (event) => {
        //definição de funções callbacks, caso necessárias
        let callback = null;
        //se o evento for de checkbox, as alterações prosseguirão a partir de outra função
        if(event.target.name.startsWith('checkbox')) {
            this.handleCheckboxChange(event);
            return;
        }
        if(event.target.name.startsWith('password')) callback = this.validatePassword;
        if(event.target.name === 'filterText') callback = this.applyFilters;

        this.setState({ [event.target.name]: event.target.value }, callback);
    };

    fillList = () => {
        const url = window.server + "/users";

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url,requestOptions)
            .then((response) => response.json())
                .then((data) => this.setState({users: data, filteredData: data}));
    }

    beginRegistration = () => {
        this.setState({ showModalRegistration: true });
    }

    validatePassword = () => {
        if(!this.state.password || !this.state.passwordConfirm) return false;
        const passwordConfirmElement = document.getElementById('passwordConfirm');
        if(this.state.password !== this.state.passwordConfirm) {
          passwordConfirmElement.setCustomValidity('As senhas não conferem');
          passwordConfirmElement.classList.add('is-invalid');
        } else {
            passwordConfirmElement.setCustomValidity('');
            passwordConfirmElement.classList.remove('is-invalid');
        }

        return passwordConfirmElement.checkValidity();
      }

    validateForm = () => {
        const { completeName, login, email, password, passwordConfirm } = this.state;
        if (!completeName || !login || !email || !password || !passwordConfirm) {
            return false;
        }
        return this.validatePassword();
    }

    clearState = () => {
        this.setState({
            completeName: '',
            login: '',
            email: '',
            password: '',
            passwordConfirm: '',
            checkboxChangePassword: true,
            checkboxNotifyEmail: true
        });
    }

    closeModal = (operationName) => {
        this.clearState();
        this.setState({ ['showModal' + operationName]: false, ['to' + operationName + 'Item']: null });
    }

    registerForm = (event) => {
        event.preventDefault();
        
        if(!this.validateForm()) {
            toast.warning('Campos preenchidos inválidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        let url = window.server + "/auth/register";

        const data = {
            "nomeCompleto": this.state.completeName,
            "matricula": this.state.login,
            "email": this.state.email,
            "password": this.state.password,
            "mustChangePassword": this.state.checkboxChangePassword || false
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch(url, requestOptions)
        .then((response) => {
            if (response.status === 200) {
                this.closeModal('Registration');
                toast.success('Usuário criado!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                }, 2000);
                this.clearState();
                this.fillList();
                return;
            } else {
            toast.error('Erro ao criar', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            throw new Error('Falha na requisição: ' + response.status);
            }
        })
        .catch(e => { console.error(e) });
    }

    componentDidMount() {
        this.fillList();
    }

    render() {
        return (
        <div>
            <Navbar />

            <div className='page-content'>
                <h1 className='display-6 fw-bold text-decoration-underline p-3'>Usuários</h1>
                
                <ToastContainer />

                <div className='col-12 col-md-3 ms-5'>
                    <div className="card mx-3" style={{ maxWidth: '200px' }}>
                        <div className="card-body">
                            <button 
                                type="button" 
                                className="btn btn-success fw-bold w-100" 
                                onClick={this.beginRegistration}
                            >
                                <i className="bi bi-plus-circle-dotted fs-6 me-2"></i>Incluir
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="card mx-5 p-3">
                    <div className="card-body">
                        <div className="table-responsive border-rounded">
                            
                            <DataTable
                                columns={this.columns}
                                data={this.state.filteredData}
                                pagination
                                customStyles={this.tableStyle}
                                responsive
                                fixedHeader
                                noDataComponent="Nenhum usuário encontrado"
                                subHeader
                                subHeaderComponent={
                                    <div className='form-group'>
                                        <input id='filterTextTitulo' type="text" className='form-control' placeholder="Buscar..." 
                                        name='filterText'
                                        value={this.state.filterText}
                                        onChange={this.handleChange}
                                        />
                                    </div>
                                }
                                
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='modals'>
                <Modal show={this.state.showModalRegistration} onHide={() => this.closeModal('Registration')} centered>
                    <Modal.Header closeButton className='bg-dark text-white'>
                        <Modal.Title>Novo Usuário</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.registerForm}>
                    <Modal.Body>
                            <div className="mb-3 row justify-content-center">  
                                <div className='col-12'>
                                <label htmlFor="completeName" className='required'>Nome Completo</label>
                                <input type="text" className="form-control" id="completeName" name="completeName" required onChange={this.handleChange}></input>
                                </div>
                            </div>
                            <div className="mb-3 row justify-content-center">
                                <div className='col-12'>
                                    <label htmlFor="login" className='required'>Matrícula ou CPF</label>
                                    <input type="text" className="form-control" id="login" name="login" required maxLength={11} onChange={this.handleChange}></input>
                                </div>
                            </div>
                            <div className="mb-3 row justify-content-center">  
                                <div className='col-12'>
                                <label htmlFor="email" className='required'>E-mail</label>
                                <input type="email" className="form-control" id="email" name="email" required placeholder="email@email.com" onChange={this.handleChange}></input>
                                </div>
                            </div>
                            <div className="mb-4 row justify-content-center">
                                <div className='col-12'>
                                <label htmlFor="password" className="col-form-label required">Senha</label>
                                <input type="password" className="form-control" id="password" name="password" required onChange={this.handleChange}></input>
                                </div>
                            </div>
                            <div className="mb-4 row justify-content-center">
                                <div className='col-12'>
                                <label htmlFor="passwordConfirm" className="col-form-label required">Confirme a senha</label>
                                <input type="password" className="form-control" id="passwordConfirm" name="passwordConfirm" onChange={this.handleChange} required></input>
                                <div className="invalid-feedback">As senhas não conferem</div>
                                </div>
                            </div>
                            <div className="px-3"> 
                                <div className="form-check form-switch mb-3">
                                    <input className="form-check-input" type="checkbox" value="" name="checkboxChangePassword" checked={this.state.checkboxChangePassword} onChange={this.handleChange} />
                                    <label className="form-check-label" htmlFor=""> Usuário deve trocar a senha </label>
                                </div>
                                {/* <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" value="" name="checkboxNotifyEmail" checked={this.state.checkboxNotifyEmail} onChange={this.handleChange}/>
                                    <label class="form-check-label" htmlFor=""> Notificar por e-mail </label>
                                </div> */}
                            </div>
                            
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.closeModal('Registration')}>
                            Cancelar
                        </Button>
                        <Button variant="success" type='submit'>
                            Criar
                        </Button>
                    </Modal.Footer>
                    </form>
                </Modal>
                
            </div>
        </div>
        )
  }
}

export default Users;
