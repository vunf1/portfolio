import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import type { Personal, Social } from '../../types/portfolio'
import profileUrl from '@/img/profile.jpg'

interface LandingAboutProps {
  personal: Personal
  social: Social[]
  className?: string
  onNavigateToPortfolio: () => void
}

export function LandingAbout({ personal, social, className = '', onNavigateToPortfolio }: LandingAboutProps) {
  const { t, currentLanguage } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('about')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className={`landing-about landing-section ${className}`}>
      <div className="about-container">
        <div className={`about-header ${isVisible ? 'about-header-visible' : ''}`}>
          <h2 className="about-title">
            <span className="about-title-main">{currentLanguage === 'pt-PT' ? 'Sobre Mim' : 'About Me'}</span>
          </h2>
          <p className="about-subtitle">
            {currentLanguage === 'pt-PT'
              ? 'Especialista em tecnologia com mais de uma década de experiência em desenvolvimento de software, automação, infraestrutura de TI e soluções técnicas'
              : 'Technology specialist with over a decade of experience in software development, automation, IT infrastructure, and technical solutions'}
          </p>
        </div>
        
        <div className={`about-content ${isVisible ? 'about-content-visible' : ''}`}>
          <div className="about-text">
            <div className="about-profile-section">
              <picture className="about-profile-picture">
                <img 
                  src={profileUrl} 
                  alt={`${personal.name} - ${personal.title}`}
                  className="about-profile-image"
                />
              </picture>
              
              <div className="about-profile-info">
                <h3 className="about-profile-name">{personal.name}</h3>
                <p className="about-profile-title">{personal.title}</p>
                <p className="about-profile-tagline">{personal.tagline}</p>
              </div>
            </div>
            
            <p className="about-description">
              {currentLanguage === 'pt-PT'
                ? 'Apaixonei-me por computadores desde criança e cresci a observar a evolução tecnológica diante dos meus olhos, o que foi e continua a ser prodigioso. Comecei a estudar conceitos básicos de informática aos 10 anos, apenas pelo prazer de aprender, vendo a minha capacidade de lógica e resolução de problemas a entrar em ação na área de hardware. A programação começou aos 14 anos e desenvolvi um lema que gosto de transmitir: "Pensar e Executar". Desenvolvi uma relação muito forte com a aprendizagem, não em termos de dependência, mas na necessidade saudável de aprender cada vez mais para poder executar as tarefas. Tudo o que sei aprendi em frente a um computador, pesquisando e aprendendo, nunca tentando copiar o conhecimento de outros, mas sim aprender a realizar a tarefa. Compreendo que vivemos em dois mundos: o real e o digital. Comecei a compreender o mundo digital desde tenra idade e sempre fui uma pessoa que se adapta facilmente ao ambiente que a rodeia. Para além do desenvolvimento de software, ofereço serviços de reparação de computadores, instalação e manutenção de racks de servidores, consultoria em TI e configuração de sistemas de transmissão em direto.'
                : 'I have loved computers since I was a child and grew up watching technological evolution unfold before my eyes, which was and still is prodigious. I began self-studying basic computer concepts at the age of 10, simply for the pleasure of learning, watching my logic and problem-solving abilities come into action in the hardware area. Programming started at the age of 14, and I developed a motto I like to share: "Think & Execute". I developed a very strong relationship with learning, not in terms of addiction, but in the healthy need to learn more and more to be able to execute tasks. Everything I know I learned in front of a computer, searching and learning, never trying to copy others\' knowledge, but rather learning how to accomplish the task. I understand that we live in two worlds: the real and the digital. I started understanding the digital world from an early age and have always been a person who can easily adapt to the environment around me. Beyond software development, I offer computer repair services, server rack installation and maintenance, IT consulting, and live streaming system setup.'}
            </p>
            
            <div className="about-details">
              <div className="about-detail-item">
                <i className="fa-solid fa-map-marker-alt"></i>
                <div>
                  <strong>{currentLanguage === 'pt-PT' ? 'Localização' : 'Location'}</strong>
                  <p>{personal.location}</p>
                </div>
              </div>
              
              <div className="about-detail-item">
                <i className="fa-solid fa-clock"></i>
                <div>
                  <strong>{currentLanguage === 'pt-PT' ? 'Disponibilidade' : 'Availability'}</strong>
                  <p>{personal.availability}</p>
                </div>
              </div>
              
              {personal.remote && (
                <div className="about-detail-item">
                  <i className="fa-solid fa-laptop"></i>
                  <div>
                    <strong>{currentLanguage === 'pt-PT' ? 'Trabalho Remoto' : 'Remote Work'}</strong>
                    <p>{personal.remote}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="about-actions">
              <button
                className="btn-about-primary"
                onClick={onNavigateToPortfolio}
              >
                <i className="fa-solid fa-arrow-right"></i>
                <span>{currentLanguage === 'pt-PT' ? 'Ver Portfolio Completo' : 'View Full Portfolio'}</span>
              </button>
            </div>
          </div>
          
          <div className="about-sidebar">
            <div className="about-core-values">
              <h3 className="core-values-title">
                {currentLanguage === 'pt-PT' ? 'Valores Fundamentais' : 'Core Values'}
              </h3>
              <ul className="core-values-list">
                {personal.coreValues.map((value, index) => (
                  <li key={index} className="core-value-item">
                    <i className="fa-solid fa-check-circle"></i>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="about-social">
              <h3 className="social-title">
                {currentLanguage === 'pt-PT' ? 'Conecte-se Comigo' : 'Connect with Me'}
              </h3>
              <div className="social-links-grid">
                {social
                  .filter((socialItem) => socialItem.name !== 'Portfolio' && socialItem.name !== 'Carteira')
                  .map((socialItem) => (
                    <a 
                      key={socialItem.name} 
                      href={socialItem.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-item"
                      style={{ '--social-color': socialItem.color || '#3b82f6' }}
                      title={socialItem.description}
                    >
                      <i className={`fa ${socialItem.icon}`}></i>
                      <span className="social-name">{socialItem.name}</span>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
