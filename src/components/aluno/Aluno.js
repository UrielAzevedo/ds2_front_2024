import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import '../../assets/css/tcc.css';

function withNavigate(Component) {
    return (props) => {
      const navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
  }

class Aluno extends Component {
  
    state = {
        alunos: []
    }

    fillList = () => {
        console.log(window.server)
        const url = window.server + "/alunos";

        const token = sessionStorage.getItem('token');
        console.log(token)

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
                .then((data) => this.setState({alunos: data}))
        .catch(e => { console.log(e) }) 

        console.log(this.state.alunos)
    }

    backToHome = () => {
        this.props.navigate('/home');
    }

    componentDidMount() {
        this.fillList();
    }

    render() {
        return (
        <div>
            <button className='btn btn-primary m-3' onClick={this.backToHome}><i className='bi bi-arrow-left'></i></button>
            <table className="table table-bordered table-hover" id="data-table">
                <tbody>
                <h1 className='tittle tittleAfter'>Alunos</h1>
                    {/* {this.state.alunos && this.state.alunos.length > 0 ? this.state.alunos.map(aluno => (
                    <tr key={aluno.id}>
                        <th scope="row">{aluno.id}</th>
                        <td>{aluno.nomeCompleto}</td>
                        <td className="text-center">{aluno.matricula}</td>
                    </tr>
                    )) : null} */}
                    <ToastContainer>

                    </ToastContainer>
                </tbody>
            </table>
        </div>
        )
  }
}

export default withNavigate(Aluno);
