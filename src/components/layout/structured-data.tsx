interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'WebPage' | 'Service' | 'Article'
  data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'SourceKom',
          description: 'Innovative resource sharing and legal consultancy platform in Saudi Arabia',
          url: 'https://sourcekom.com',
          logo: 'https://sourcekom.com/logo.png',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+966-50-123-4567',
            contactType: 'customer service',
            availableLanguage: ['English', 'Arabic']
          },
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'SA',
            addressLocality: 'Riyadh'
          },
          sameAs: [
            // Add social media URLs when available
          ],
          ...data
        }

      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'SourceKom',
          url: 'https://sourcekom.com',
          description: 'Resource management and legal consultancy platform in Saudi Arabia',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://sourcekom.com/browse?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          },
          ...data
        }

      case 'WebPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: data.title,
          description: data.description,
          url: data.url,
          lastReviewed: data.lastReviewed || new Date().toISOString(),
          reviewedBy: {
            '@type': 'Organization',
            name: 'SourceKom'
          },
          ...data
        }

      case 'Service':
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: data.name,
          description: data.description,
          provider: {
            '@type': 'Organization',
            name: 'SourceKom'
          },
          areaServed: {
            '@type': 'Country',
            name: 'Saudi Arabia'
          },
          ...data
        }

      case 'Article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.description,
          author: {
            '@type': 'Organization',
            name: 'SourceKom'
          },
          publisher: {
            '@type': 'Organization',
            name: 'SourceKom',
            logo: {
              '@type': 'ImageObject',
              url: 'https://sourcekom.com/logo.png'
            }
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url
          },
          ...data
        }

      default:
        return data
    }
  }

  const structuredData = getStructuredData()

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}