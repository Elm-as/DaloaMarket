import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
const FAQS: FAQItem[] = [
  {
    question: "Comment fonctionne le paiement des annonces ?",
    answer: "Le paiement se fait manuellement après la création de votre annonce. Vous recevrez les instructions à l'écran. Il n'y a plus de paiement automatique ni de boost.",
  },
  {
    question: "À quoi servent les crédits ?",
    answer: "Les crédits servent uniquement à publier des annonces. Il n'y a plus de boost ni d'autres options payantes.",
  },
  {
    question: "Comment acheter des crédits ?",
    answer: "Rendez-vous sur la page 'Acheter des crédits' et suivez les instructions. Le paiement est manuel.",
  },
  {
    question: "Puis-je booster mon annonce ?",
    answer: "Non, la fonctionnalité de boost a été retirée. Toutes les annonces sont affichées de façon équitable.",
  },
];
  
  return (
    <div className="min-h-screen bg-grey-50 py-8">
      <div className="container-custom max-w-3xl">
        <div className="bg-white rounded-card shadow-card p-6 md:p-8">
          <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-800 rounded">
            ⚠️ DaloaMarket est en <strong>phase de test (version bêta)</strong>. Certaines fonctionnalités peuvent évoluer rapidement. Merci pour votre compréhension et vos retours !
          </div>
          <h1 className="text-2xl font-bold mb-6">Questions fréquentes</h1>
          
          <div className="space-y-4">
            {FAQS.map((faq: FAQItem, index: number) => (
              <div 
                key={index} 
                className="border border-grey-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-4 text-left font-medium focus:outline-none"
                  aria-label={`Toggle FAQ ${index + 1}: ${faq.question}`}
                >
                  <span>{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-grey-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-grey-500" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="p-4 pt-0 text-grey-600 border-t border-grey-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-primary-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Vous avez d'autres questions ?</h2>
            <p className="text-grey-600 mb-4">
              N'hésitez pas à nous contacter si vous ne trouvez pas la réponse à votre question.
            </p>
            <a 
              href="mailto:support@daloamarket.shop" 
              className="btn-primary inline-block transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Contacter le support
            </a>
          </div>

          <div className="mt-8 text-sm text-grey-600 text-center">
            Besoin d'informations sur le projet ou son créateur ? <a href="/about" className="text-primary underline">Voir la page À propos</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;