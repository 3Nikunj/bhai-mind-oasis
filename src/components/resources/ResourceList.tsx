
import { useState } from 'react';
import { ResourceCard } from './ResourceCard';
import { ResourceModal } from './ResourceModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Resource } from '@/types';
import { Search } from 'lucide-react';

const resources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Depression',
    description: 'Depression is more than just feeling sad. Learn about the symptoms, causes, and treatment options for depression.',
    category: 'depression',
    content: `# Understanding Depression

Depression is a common and serious medical illness that negatively affects how you feel, the way you think and how you act. It can lead to a variety of emotional and physical problems and can decrease a person's ability to function at work and at home.

## Symptoms
- Persistent sad, anxious, or "empty" mood
- Loss of interest in activities once enjoyed
- Decreased energy, fatigue
- Difficulty sleeping or oversleeping
- Appetite changes
- Thoughts of death or suicide
- Difficulty concentrating or making decisions

## Causes
Depression can be caused by a combination of genetic, biological, environmental, and psychological factors. Risk factors include personal or family history of depression, major life changes, trauma, stress, and certain physical illnesses and medications.

## Treatment Options
- Medication: Antidepressants can help improve the way your brain uses certain chemicals that control mood or stress.
- Psychotherapy: Talking with a trained therapist can help you learn skills to cope with negative feelings.
- Self-help: Regular exercise, getting enough sleep, and spending time with people you care about can improve symptoms.

## When to Seek Professional Help
If you have experienced symptoms of depression for more than two weeks, consider reaching out to a healthcare provider. If you are having thoughts of harming yourself, please call a crisis helpline immediately.`
  },
  {
    id: '2',
    title: 'Managing Anxiety',
    description: 'Anxiety disorders are the most common mental health condition. Discover effective strategies to manage anxiety symptoms.',
    category: 'anxiety',
    content: `# Managing Anxiety

Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. While it's normal to feel anxious at times, excessive anxiety that interferes with daily activities may indicate an anxiety disorder.

## Common Symptoms
- Excessive worry
- Restlessness
- Feeling on edge
- Fatigue
- Difficulty concentrating
- Irritability
- Muscle tension
- Sleep problems

## Types of Anxiety Disorders
- Generalized Anxiety Disorder (GAD)
- Panic Disorder
- Social Anxiety Disorder
- Specific Phobias
- Obsessive-Compulsive Disorder (OCD)
- Post-Traumatic Stress Disorder (PTSD)

## Management Strategies
- Deep breathing exercises
- Progressive muscle relaxation
- Mindfulness meditation
- Regular physical activity
- Limiting caffeine and alcohol
- Maintaining a regular sleep schedule
- Cognitive Behavioral Therapy (CBT)
- Medication when necessary

## Self-Help Techniques
1. **4-7-8 Breathing**: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds.
2. **Grounding**: Identify 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.
3. **Challenge negative thoughts**: Ask yourself if your worries are based on facts or assumptions.`
  },
  {
    id: '3',
    title: 'Coping with Stress',
    description: 'Stress is a normal part of life, but too much can affect your health. Learn effective stress management techniques.',
    category: 'stress',
    content: `# Coping with Stress

Stress is your body's reaction to a challenge or demand. In short bursts, stress can be positive, but chronic stress can have serious effects on your physical and mental health.

## How Stress Affects Your Body
- Headaches
- Muscle tension or pain
- Chest pain
- Fatigue
- Stomach upset
- Sleep problems
- Changes in appetite

## How Stress Affects Your Mind
- Anxiety
- Restlessness
- Lack of motivation or focus
- Irritability or anger
- Sadness or depression
- Feeling overwhelmed

## Healthy Stress Management
- Regular physical activity
- Relaxation techniques (deep breathing, meditation, yoga)
- Setting realistic goals
- Prioritizing tasks
- Making time for hobbies
- Connecting with supportive people
- Getting enough sleep

## Daily Stress-Reduction Practices
1. Take short breaks throughout the day
2. Go for a 10-minute walk
3. Practice mindful eating
4. Limit screen time before bed
5. Create a gratitude journal
6. Set boundaries with work and digital devices`
  },
  {
    id: '4',
    title: 'Understanding PTSD',
    description: 'Post-Traumatic Stress Disorder can develop after experiencing a traumatic event. Learn about symptoms and treatment options.',
    category: 'ptsd',
    content: `# Understanding PTSD

Post-traumatic stress disorder (PTSD) is a mental health condition triggered by experiencing or witnessing a terrifying event. Symptoms may include flashbacks, nightmares, severe anxiety, and uncontrollable thoughts about the event.

## Common Symptoms
- Intrusive memories
- Avoidance
- Negative changes in thinking and mood
- Changes in physical and emotional reactions
- Heightened reactivity to stimuli

## Causes
PTSD can develop after exposure to a traumatic event such as:
- Combat exposure
- Physical or sexual assault
- Serious accidents
- Natural disasters
- Childhood abuse
- Witnessing death or violence

## Treatment Approaches
- Cognitive Behavioral Therapy (CBT)
- Eye Movement Desensitization and Reprocessing (EMDR)
- Exposure therapy
- Medication
- Support groups

## Coping Strategies
1. Learn about trauma and its effects
2. Join a PTSD support group
3. Practice relaxation techniques
4. Pursue outdoor activities
5. Confide in a trusted person
6. Follow a healthy lifestyle
7. Avoid alcohol and drugs`
  },
  {
    id: '5',
    title: 'The Importance of Self-Care',
    description: 'Self-care is crucial for maintaining good mental health. Discover simple self-care practices you can incorporate into your daily routine.',
    category: 'general',
    content: `# The Importance of Self-Care

Self-care means taking the time to do things that help you live well and improve both your physical health and mental health. When it comes to your mental health, self-care can help you manage stress, lower your risk of illness, and increase your energy.

## Physical Self-Care
- Getting enough sleep (7-9 hours for most adults)
- Eating nutritious, balanced meals
- Drinking plenty of water
- Engaging in regular physical activity
- Attending regular health check-ups

## Mental Self-Care
- Practicing mindfulness or meditation
- Keeping a journal
- Reading books or articles that interest you
- Doing puzzles or brain games
- Learning a new skill or hobby

## Emotional Self-Care
- Setting healthy boundaries
- Expressing your feelings constructively
- Allowing yourself to feel emotions without judgment
- Practicing self-compassion
- Engaging with a therapist when needed

## Social Self-Care
- Spending time with positive, supportive people
- Asking for help when needed
- Joining clubs or groups with similar interests
- Volunteering in your community
- Limiting time with people who drain your energy

## Self-Care During Difficult Times
1. Lower your expectations temporarily
2. Focus on basic needs first
3. Create small, achievable goals
4. Schedule brief relaxation breaks
5. Reach out for support`
  }
];

export function ResourceList() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleViewDetails = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const handleCloseModal = () => {
    setSelectedResource(null);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? resource.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'depression', label: 'Depression' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'ptsd', label: 'PTSD' },
    { id: 'stress', label: 'Stress' },
    { id: 'general', label: 'General' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
              className="text-xs"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
      
      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No resources found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
      
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
