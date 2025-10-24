import Image from 'next/image';

export interface Tribute {
  id: number;
  type: 'text' | 'image' | 'story';
  authorName: string;
  organization: string;
  date: string;
  content?: string;
  image?: string;
  caption?: string;
  aspectRatio?: 'square' | 'horizontal' | 'vertical';
}

interface TributeCardProps {
  tribute: Tribute;
}

export default function TributeCard({ tribute }: TributeCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const monthNames = [
      'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
      'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'
    ];

    return `${day} ${monthNames[month - 1]}, ${year}`;
  };

  // Type 1: TEXT CARD
  if (tribute.type === 'text') {
    // Build horizontal author info with bullet separators
    const buildAuthorLine = () => {
      const parts = [];

      // Add organization if exists
      if (tribute.organization) {
        parts.push(tribute.organization);
      }

      // Add date
      parts.push(formatDate(tribute.date));

      // Join with bullet separator (name will be separate and bold)
      return parts.join(' • ');
    };

    return (
      <div className="bg-white rounded-lg px-6 pt-6 pb-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col">
        {/* Content */}
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-6 mb-4 flex-grow">
          {tribute.content}
        </p>

        {/* Author Info - Horizontal layout with bullets */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <p className="text-gray-700 text-sm">
            <span className="font-semibold">{tribute.authorName}</span>
            {(tribute.organization || tribute.date) && ' • '}
            {buildAuthorLine()}
          </p>
        </div>
      </div>
    );
  }

  // Type 2: IMAGE CARD
  if (tribute.type === 'image') {
    const aspectClass =
      tribute.aspectRatio === 'horizontal' ? 'aspect-video' :
      tribute.aspectRatio === 'vertical' ? 'aspect-[3/4]' :
      'aspect-square';

    // Build horizontal author info with bullet separators
    const buildAuthorLine = () => {
      const parts = [];

      // Add organization if exists
      if (tribute.organization) {
        parts.push(tribute.organization);
      }

      // Add date
      parts.push(formatDate(tribute.date));

      // Join with bullet separator (name will be separate and bold)
      return parts.join(' • ');
    };

    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col">
        {/* Image */}
        <div className={`relative ${aspectClass} group overflow-hidden`}>
          <Image
            src={tribute.image!}
            alt={tribute.caption || tribute.authorName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Author Info - Horizontal layout with bullets */}
        <div className="px-4 sm:px-6 pt-4 pb-3 sm:pb-4">
          <div className="pt-4 border-t border-gray-200">
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">{tribute.authorName}</span>
              {(tribute.organization || tribute.date) && ' • '}
              {buildAuthorLine()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Type 3: STORY CARD (vertical: image → text → author)
  if (tribute.type === 'story') {
    // Build horizontal author info with bullet separators
    const buildAuthorLine = () => {
      const parts = [];

      // Add organization if exists
      if (tribute.organization) {
        parts.push(tribute.organization);
      }

      // Add date
      parts.push(formatDate(tribute.date));

      // Join with bullet separator (name will be separate and bold)
      return parts.join(' • ');
    };

    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col">
        {/* Image - Full width, aspect-square */}
        <div className="relative aspect-square group overflow-hidden">
          <Image
            src={tribute.image!}
            alt={tribute.authorName || 'Tưởng nhớ'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Text Content - Padded container */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col">
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-5 mb-4">
            {tribute.content}
          </p>

          {/* Author Info - Horizontal layout with bullets */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">{tribute.authorName || 'Tưởng nhớ'}</span>
              {(tribute.organization || tribute.date) && ' • '}
              {buildAuthorLine()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
