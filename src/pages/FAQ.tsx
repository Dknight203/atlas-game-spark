
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is GameAtlas?",
      answer: "GameAtlas is a SaaS platform that helps indie developers and game publishers discover their audience organically through data-driven community matching, without relying on social spam, ad spend, or influencer begging."
    },
    {
      question: "How does the Cross-Game Match Engine work?",
      answer: "Our engine analyzes your game's mechanics, themes, and tone to identify similar games with active communities. It then finds overlap in audiences and suggests communities where your potential players are already engaged."
    },
    {
      question: "Do I need coding experience to use GameAtlas?",
      answer: "No coding experience required! GameAtlas is designed for game developers and publishers of all technical backgrounds. Our intuitive interface guides you through the process of finding your audience."
    },
    {
      question: "What platforms does GameAtlas support?",
      answer: "GameAtlas helps you find communities across Reddit, Discord, YouTube, Twitch, and other gaming platforms where your target audience is active."
    },
    {
      question: "Can I try GameAtlas for free?",
      answer: "Yes! We offer a free plan that includes basic features like Signal Profile Builder, 1 Cross-Game Match, and 1 Community Opportunity. You can upgrade anytime for more features."
    },
    {
      question: "How accurate are the community matches?",
      answer: "Our matches are based on real community data, tag similarities, and engagement patterns. Each recommendation includes confidence labels and source links so you can verify the quality of each match."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, our Studio Toolkit and Publisher Tier plans include PDF export functionality for reports and data."
    },
    {
      question: "Do you offer support?",
      answer: "We provide email support for Studio Toolkit users and dedicated customer success management for Publisher Tier customers. Free plan users can access our documentation and community forums."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-atlas-purple">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-gray-600">
                Everything you need to know about GameAtlas
              </p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FAQ;
