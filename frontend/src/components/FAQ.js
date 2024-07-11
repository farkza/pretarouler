import React, { useState } from 'react';
import '../css/Faq.css'; // Chemin relatif vers Faq.css

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "Quels documents dois-je fournir pour louer une voiture ?",
      answer: "Les documents requis peuvent varier en fonction de la politique de location de chaque société de location de voitures. Cependant, les documents couramment requis comprennent généralement une pièce d'identité valide, un permis de conduire valide et une carte de crédit pour la caution.",
    },
    {
      question: "Quels types d’assurances sont inclus dans la location ?",
      answer: "Les types d'assurances inclus dans la location varient selon le fournisseur de location et le type de véhicule. Les assurances courantes comprennent la responsabilité civile, la collision, le vol et les dommages matériels. Il est recommandé de vérifier auprès du fournisseur de location pour connaître les détails spécifiques de la couverture d'assurance.",
    },
    {
      question: "Que faire en cas de panne ou d’accident avec la voiture de location ?",
      answer: "En cas de panne ou d'accident avec la voiture de location, il est important de contacter immédiatement le fournisseur de location et les autorités locales, le cas échéant. Suivez les instructions du fournisseur de location et remplissez tous les rapports nécessaires. Assurez-vous également de prendre des photos de tous les dommages et de conserver tous les documents pertinents.",
    },
  ];

  return (
    <section className="faq-section">
      <h2 className="faq-title">Foire aux questions</h2>
      {faqItems.map((item, index) => (
        <div key={index} className="faq-item" onClick={() => toggleAccordion(index)}>
          <div className="faq-question">
            <h3>{item.question}</h3>
            <div className={`chevron ${openIndex === index ? 'open' : ''}`}>&#8964;</div>
          </div>
          {openIndex === index && (
            <div className="faq-answer">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default FAQ;
