const { URLSearchParams } = require('url');

// Test the mailto link generation
const personal = { name: 'João Maia', email: 'joaomaia.trabalho@gmail.com' };
const currentLanguage = 'pt-PT';

const isPortuguese = currentLanguage === 'pt-PT';
const subject = isPortuguese 
  ? `Vamos Conectar - ${personal.name}`
  : `Let's Connect - ${personal.name}`;

const body = isPortuguese
  ? `Olá ${personal.name.split(' ')[0]},\n\nEncontrei o seu portfólio e gostaria de conectar sobre oportunidades potenciais.\n\nCumprimentos,`
  : `Hello ${personal.name.split(' ')[0]},\n\nI came across your portfolio and would like to connect regarding potential opportunities.\n\nBest regards,`;

const params = new URLSearchParams({
  subject: subject,
  body: body,
  'X-Priority': '1',
  'X-MSMail-Priority': 'High',
  'Importance': 'high',
  'X-Mailer': 'Portfolio Contact Form'
});

const mailtoLink = `mailto:${personal.email}?${params.toString()}`;
console.log('Generated mailto link:');
console.log(mailtoLink);
console.log('\nDecoded parameters:');
console.log('Subject:', decodeURIComponent(subject));
console.log('Body:', decodeURIComponent(body));
console.log('Priority headers:', {
  'X-Priority': '1 (High)',
  'X-MSMail-Priority': 'High',
  'Importance': 'high'
});

// Test English version
console.log('\n--- English Version ---');
const currentLanguageEn = 'en';
const isPortugueseEn = currentLanguageEn === 'pt-PT';
const subjectEn = isPortugueseEn 
  ? `Vamos Conectar - ${personal.name}`
  : `Let's Connect - ${personal.name}`;

const bodyEn = isPortugueseEn
  ? `Olá ${personal.name.split(' ')[0]},\n\nEncontrei o seu portfólio e gostaria de conectar sobre oportunidades potenciais.\n\nCumprimentos,`
  : `Hello ${personal.name.split(' ')[0]},\n\nI came across your portfolio and would like to connect regarding potential opportunities.\n\nBest regards,`;

const paramsEn = new URLSearchParams({
  subject: subjectEn,
  body: bodyEn,
  'X-Priority': '1',
  'X-MSMail-Priority': 'High',
  'Importance': 'high',
  'X-Mailer': 'Portfolio Contact Form'
});

const mailtoLinkEn = `mailto:${personal.email}?${paramsEn.toString()}`;
console.log('Generated mailto link (EN):');
console.log(mailtoLinkEn);
console.log('\nDecoded parameters (EN):');
console.log('Subject:', decodeURIComponent(subjectEn));
console.log('Body:', decodeURIComponent(bodyEn));
