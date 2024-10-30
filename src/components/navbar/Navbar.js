import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Navbar extends Component {

  logout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  }

  render() {
    return (
        <nav className="navbar navbar-dark fixed-top">
          <div className="container-fluid">
            <button className="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Barra de menu">
              <span className="fs-1" style={{color: 'black'}}><i className="bi bi-list"></i></span>
            </button>
            {/* <Link to="/" className='navbar-brand' onClick={() => this.markCurrentPageLink('linkToHome')}><i className="bi bi-house-fill"></i> Home</Link> */}
            <div className="offcanvas offcanvas-start bg-custom-blue rounded-end-5 p-5 ps-4" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
              <div className="offcanvas-header border-bottom">
                <h5 className="offcanvas-title text-white display-5" id="offcanvasDarkNavbarLabel">Menu</h5>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 fs-5">
                  <li className="nav-item">
                    <Link to="/home" className='nav-link active text-white' id="linkToHome">Início</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/alunos" className='nav-link active' id="linkToHome">Alunos</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/orientadores" className='nav-link active' id="linkToHome">Orientadores</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/tcc" className='nav-link active' id="linkToHome">Trabalhos de Conclusão</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/home" className='nav-link active' id="linkToHome">Meu TCC</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/users" className='nav-link active' id="linkToHome">Usuários</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div>
                <button type="button" aria-label="Usuário" className='btn btn-light border-0'><span><i className="bi bi-person-circle fs-2 p-2"></i>Nome Aluno(a)</span></button>
                <button type="button" aria-label="Notificações" className='btn btn-light border-0'><span className='w-100'><i className="bi bi-bell fs-2"></i></span></button>
                <button type="button" aroa-label="Sair do Sistema" className='btn border-0 btn-light' onClick={this.logout}><span><i className='bi bi-box-arrow-left fs-2'></i></span></button>
            </div>
          </div>
        </nav>
      )
  }
}
