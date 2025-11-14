import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import type { Personal } from '../../types/portfolio'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

interface LandingFeaturesProps {
  personal: Personal
  className?: string
}

export function LandingFeatures({ personal, className = '' }: LandingFeaturesProps) {
  const { currentLanguage } = useTranslation()
  const [activeService, setActiveService] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const services: Service[] = [
    {
      id: 'full-stack',
      title: currentLanguage === 'pt-PT' ? 'Engenharia de Software Full-Stack' : 'Full-Stack Software Engineering',
      description: currentLanguage === 'pt-PT' 
        ? 'Desenvolvimento completo de aplicações desde a interface do utilizador até aos servidores, incluindo bases de dados e integração de sistemas para soluções empresariais completas.'
        : 'Complete application development from user interface to server infrastructure, including databases and system integration for end-to-end business solutions.',
      icon: 'fa-solid fa-code',
      color: '#3b82f6'
    },
    {
      id: 'ai-automation',
      title: currentLanguage === 'pt-PT' ? 'Integração de IA e Automação' : 'AI Integration & Process Automation',
      description: currentLanguage === 'pt-PT'
        ? 'Implementação de inteligência artificial e automação de processos de negócio para reduzir custos operacionais e melhorar a produtividade da sua equipa.'
        : 'Implementation of artificial intelligence and business process automation to reduce operational costs and improve your team\'s productivity.',
      icon: 'fa-solid fa-robot',
      color: '#8b5cf6'
    },
    {
      id: 'web-applications',
      title: currentLanguage === 'pt-PT' ? 'Aplicações Web Empresariais' : 'Enterprise Web Applications',
      description: currentLanguage === 'pt-PT'
        ? 'Criação de aplicações web modernas e responsivas que funcionam perfeitamente em todos os dispositivos, otimizadas para velocidade e facilidade de utilização.'
        : 'Building modern, responsive web applications that work seamlessly across all devices, optimized for speed and ease of use.',
      icon: 'fa-solid fa-globe',
      color: '#06b6d4'
    },
    {
      id: 'cloud-solutions',
      title: currentLanguage === 'pt-PT' ? 'Infraestrutura Cloud' : 'Cloud Infrastructure & Solutions',
      description: currentLanguage === 'pt-PT'
        ? 'Configuração e gestão de soluções em nuvem escaláveis e seguras que crescem com o seu negócio, garantindo disponibilidade e proteção dos seus dados.'
        : 'Setup and management of scalable, secure cloud solutions that grow with your business, ensuring data availability and protection.',
      icon: 'fa-solid fa-cloud',
      color: '#10b981'
    },
    {
      id: 'live-streaming',
      title: currentLanguage === 'pt-PT' ? 'Transmissão em Direto e Overlays' : 'Live Streaming & Overlays',
      description: currentLanguage === 'pt-PT'
        ? 'Configuração de sistemas de transmissão em direto profissionais com gráficos personalizados, overlays e integração de múltiplas fontes de vídeo para eventos e apresentações.'
        : 'Professional live streaming setup with custom graphics, overlays, and multi-source video integration for events and presentations.',
      icon: 'fa-solid fa-video',
      color: '#ef4444'
    },
    {
      id: 'computer-repair',
      title: currentLanguage === 'pt-PT' ? 'Reparação e Manutenção de Computadores' : 'Computer Repair & Maintenance',
      description: currentLanguage === 'pt-PT'
        ? 'Serviços de diagnóstico, reparação e manutenção preventiva de computadores e equipamentos informáticos para manter os seus sistemas a funcionar de forma eficiente.'
        : 'Diagnostic, repair, and preventive maintenance services for computers and IT equipment to keep your systems running efficiently.',
      icon: 'fa-solid fa-screwdriver-wrench',
      color: '#f59e0b'
    },
    {
      id: 'it-consulting',
      title: currentLanguage === 'pt-PT' ? 'Consultoria em TI' : 'IT Consulting',
      description: currentLanguage === 'pt-PT'
        ? 'Aconselhamento estratégico em tecnologia da informação para ajudar a sua empresa a tomar decisões informadas sobre infraestrutura, software e processos digitais.'
        : 'Strategic information technology consulting to help your business make informed decisions about infrastructure, software, and digital processes.',
      icon: 'fa-solid fa-lightbulb',
      color: '#6366f1'
    },
    {
      id: 'server-rack',
      title: currentLanguage === 'pt-PT' ? 'Instalação e Manutenção de Racks de Servidores' : 'Server Rack Installation & Maintenance',
      description: currentLanguage === 'pt-PT'
        ? 'Instalação profissional de racks de servidores, organização de cablagem, gestão de energia e manutenção preventiva para garantir máxima fiabilidade do seu centro de dados.'
        : 'Professional server rack installation, cable management, power distribution, and preventive maintenance to ensure maximum reliability of your data center.',
      icon: 'fa-solid fa-server',
      color: '#14b8a6'
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('features')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [services.length])

  return (
    <section id="features" className={`landing-features landing-section ${className}`}>
      <div className="features-container">
        <div className={`features-header ${isVisible ? 'features-header-visible' : ''}`}>
          <h2 className="features-title">
            <span className="features-title-main">
              {currentLanguage === 'pt-PT' ? 'Serviços e' : 'Services &'}
            </span>
            <span className="features-title-accent">
              {currentLanguage === 'pt-PT' ? 'Especialidades' : 'Expertise'}
            </span>
          </h2>
          <p className="features-subtitle">
            {currentLanguage === 'pt-PT'
              ? `Soluções profissionais lideradas por ${personal.name}, com foco em qualidade, eficiência e inovação`
              : `Professional solutions led by ${personal.name}, focused on quality, efficiency, and innovation`}
          </p>
        </div>

        <div className="features-grid">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`feature-card ${activeService === index ? 'feature-card-active' : ''} ${isVisible ? 'feature-card-visible' : ''}`}
              style={{ '--delay': `${index * 0.15}s`, '--service-color': service.color }}
              onMouseEnter={() => setActiveService(index)}
              onFocus={() => setActiveService(index)}
            >
              <div className="feature-card-inner">
                <div className="feature-icon" style={{ '--feature-color': service.color }}>
                  <i className={service.icon}></i>
                </div>
                
                <div className="feature-content">
                  <h3 className="feature-title">{service.title}</h3>
                  <p className="feature-description">{service.description}</p>
                </div>
                
                <div className="feature-indicator">
                  <div className="indicator-line"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="features-approach">
          <div className={`approach-content ${isVisible ? 'approach-content-visible' : ''}`}>
            <div className="approach-text">
              <h3 className="approach-title">
                {currentLanguage === 'pt-PT' ? 'Como Trabalho' : 'How I Work'}
              </h3>
              <p className="approach-description">
                {currentLanguage === 'pt-PT'
                  ? 'Acredito que a melhor tecnologia é aquela que resolve problemas reais e torna a vida das pessoas mais fácil. Trabalho de perto com os meus clientes para entender as suas necessidades, desafios e objetivos. Não se trata apenas de escrever código - é sobre criar soluções que realmente fazem a diferença no dia a dia, que poupam tempo, reduzem custos e melhoram a forma como trabalham. Desde a primeira conversa até à entrega final, mantenho uma comunicação aberta e transparente, garantindo que está sempre a par do progresso e que o resultado final corresponde exatamente ao que precisa.'
                  : 'I believe the best technology solves real problems and makes people\'s lives easier. I work closely with my clients to understand their needs, challenges, and goals. It\'s not just about writing code - it\'s about creating solutions that truly make a difference in daily operations, that save time, reduce costs, and improve how people work. From our first conversation to final delivery, I maintain open and transparent communication, ensuring you\'re always aware of progress and that the final result matches exactly what you need.'}
              </p>
              
              <div className="approach-highlights">
                <div className="approach-highlight">
                  <i className="fa-solid fa-check-circle"></i>
                  <span>
                    {currentLanguage === 'pt-PT' 
                      ? 'Foco nas suas necessidades - Entendo o seu negócio antes de propor soluções'
                      : 'Focused on your needs - I understand your business before proposing solutions'}
                  </span>
                </div>
                <div className="approach-highlight">
                  <i className="fa-solid fa-check-circle"></i>
                  <span>
                    {currentLanguage === 'pt-PT' 
                      ? 'Comunicação clara e transparente - Atualizações regulares e explicações simples'
                      : 'Clear and transparent communication - Regular updates and simple explanations'}
                  </span>
                </div>
                <div className="approach-highlight">
                  <i className="fa-solid fa-check-circle"></i>
                  <span>
                    {currentLanguage === 'pt-PT' 
                      ? 'Soluções práticas e eficientes - Tecnologia que funciona no mundo real'
                      : 'Practical and efficient solutions - Technology that works in the real world'}
                  </span>
                </div>
                <div className="approach-highlight">
                  <i className="fa-solid fa-check-circle"></i>
                  <span>
                    {currentLanguage === 'pt-PT' 
                      ? 'Suporte contínuo - Estou aqui mesmo depois do projeto estar concluído'
                      : 'Ongoing support - I\'m here even after the project is complete'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="approach-visual">
              <div className="approach-card">
                <div className="approach-card-header">
                  <div className="approach-card-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="approach-card-body">
                  <div className="approach-stats">
                    <div className="approach-stat">
                      <div className="approach-stat-icon">
                        <i className="fa-solid fa-handshake"></i>
                      </div>
                      <div className="approach-stat-content">
                        <h4>
                          {currentLanguage === 'pt-PT' ? 'Parceria' : 'Partnership'}
                        </h4>
                        <p>
                          {currentLanguage === 'pt-PT' 
                            ? 'Trabalhamos juntos como uma equipa, não apenas como cliente e fornecedor'
                            : 'We work together as a team, not just as client and vendor'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="approach-stat">
                      <div className="approach-stat-icon">
                        <i className="fa-solid fa-clock"></i>
                      </div>
                      <div className="approach-stat-content">
                        <h4>
                          {currentLanguage === 'pt-PT' ? 'Prazos Realistas' : 'Realistic Timelines'}
                        </h4>
                        <p>
                          {currentLanguage === 'pt-PT' 
                            ? 'Estabelecemos prazos alcançáveis e cumprimos o que prometemos'
                            : 'We set achievable deadlines and deliver on our promises'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="approach-stat">
                      <div className="approach-stat-icon">
                        <i className="fa-solid fa-heart"></i>
                      </div>
                      <div className="approach-stat-content">
                        <h4>
                          {currentLanguage === 'pt-PT' ? 'Suporte Dedicado' : 'Dedicated Support'}
                        </h4>
                        <p>
                          {currentLanguage === 'pt-PT' 
                            ? 'Ajuda disponível quando precisar, mesmo após a conclusão do projeto'
                            : 'Help available when you need it, even after project completion'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
