import { useState } from 'react';
import { login } from '../services/authService';

/**
 * Componente de tela de login.
 * Exibe um formulário de email e senha e autentica o usuário no back-end.
 */
interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      onLoginSuccess();
    } catch {
      setErro('Email ou senha incorretos.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a237e 0%, #1565c0 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        {/* Logo e título */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/src/assets/simbolo.png"
            alt="Logo Incubadora"
            style={{
                width: '96px',
                height: '96px',
                borderRadius: '16px',
                objectFit: 'cover',
                margin: '0 auto 16px',
                display: 'block',
                }}
            />
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a237e', margin: 0 }}>
            Incubadora de Empresas
          </h1>
          <p style={{ color: '#666', marginTop: '6px', fontSize: '14px' }}>
            PUC Goiás
          </p>
        </div>

        {/* Campo email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid #ddd',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Campo senha */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
            Senha
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid #ddd',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Mensagem de erro */}
        {erro && (
          <div style={{
            background: '#fff3f3',
            border: '1px solid #ffcdd2',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#c62828',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            {erro}
          </div>
        )}

        {/* Botão de login */}
        <button
          onClick={handleLogin}
          disabled={carregando}
          style={{
            width: '100%',
            padding: '12px',
            background: carregando ? '#90caf9' : 'linear-gradient(135deg, #1a237e, #1565c0)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: carregando ? 'not-allowed' : 'pointer',
          }}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
}