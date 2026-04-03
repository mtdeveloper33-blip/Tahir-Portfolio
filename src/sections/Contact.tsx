import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import AnimatedSection from '../components/AnimatedSection';
import SectionTitle from '../components/SectionTitle';
import { Send, MapPin, Mail, Phone, AlertCircle, CheckCircle } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is filled
    if (value.trim() && errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Prepare template parameters for EmailJS
      const templateParams = {
        name: formState.name,
        email: formState.email,
        subject: formState.subject || 'Contact Form Message',
        message: formState.message,
      };

      // Send email using EmailJS
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams
      )
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          setIsSubmitting(false);
          setSubmitStatus('success');
          setFormState({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
          
          // Reset success message after 5 seconds
          setTimeout(() => {
            setSubmitStatus(null);
          }, 5000);
        })
        .catch((error) => {
          console.log('FAILED...', error);
          setIsSubmitting(false);
          setSubmitStatus('error');
          
          // Reset error message after 5 seconds
          setTimeout(() => {
            setSubmitStatus(null);
          }, 5000);
        });
    }
  };

  return (
    <AnimatedSection id="contact" className="bg-background">
      <div className="container mx-auto">
        <SectionTitle 
          title="Contact Me" 
          subtitle="Have a project in mind or want to discuss a potential collaboration? Reach out to me!" 
          centered
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              <p className="text-text-secondary mb-8">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out using the form or through my contact information.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-background-lighter flex items-center justify-center mr-4">
                    <MapPin className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Location</h4>
                    <p className="text-text-secondary">Gojra, Punjab, Pakistan</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-background-lighter flex items-center justify-center mr-4">
                    <Mail className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email</h4>
                    <a href="mailto:tahirmehmood1827@gmail.com" className="text-text-secondary hover:text-primary transition-colors duration-300">
                      tahirmehmood1827@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-background-lighter flex items-center justify-center mr-4">
                    <Phone className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Phone</h4>
                    <a href="tel:+923061436931" className="text-text-secondary hover:text-primary transition-colors duration-300">
                      +92 306 1436931
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="card space-y-6">
              {submitStatus && (
                <div 
                  className={`p-4 rounded-lg ${
                    submitStatus === 'success' 
                      ? 'bg-success/20 border border-success text-success' 
                      : 'bg-error/20 border border-error text-error'
                  } flex items-center`}
                >
                  {submitStatus === 'success' ? (
                    <>
                      <CheckCircle className="mr-2 flex-shrink-0\" size={20} />
                      <span>Thank you for your message! I'll get back to you soon.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mr-2 flex-shrink-0" size={20} />
                      <span>There was an error sending your message. Please try again.</span>
                    </>
                  )}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                  Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className={`input ${errors.name ? 'border-error focus:ring-error' : ''}`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error flex items-center">
                    <AlertCircle size={14} className="mr-1" /> {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'border-error focus:ring-error' : ''}`}
                  placeholder="Your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error flex items-center">
                    <AlertCircle size={14} className="mr-1" /> {errors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  className="input"
                  placeholder="Your subject"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">
                  Message <span className="text-error">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={5}
                  className={`input resize-none ${errors.message ? 'border-error focus:ring-error' : ''}`}
                  placeholder="Your message"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-error flex items-center">
                    <AlertCircle size={14} className="mr-1" /> {errors.message}
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary w-full ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Send Message <Send size={18} className="ml-2" />
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Contact;