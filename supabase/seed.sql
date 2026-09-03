-- Run after the migration. The seed creates 20 original public prompts.
insert into public.prompts (title,slug,short_description,content,category_id,prompt_type,tools,tags,is_featured,is_new,is_public,sort_order)
select x.title, x.slug, x.description, 'You are an expert collaborator. Help me create a clear, specific, useful result for this brief. Goal: [DESCRIBE THE OUTCOME]. Audience: [WHO THIS IS FOR]. Context: [KEY BACKGROUND]. Constraints: [TONE, LENGTH, REQUIREMENTS]. Ask only essential questions, then provide structured practical next steps.', c.id, x.kind::public.prompt_kind, x.tools, x.tags, x.featured, x.is_new, true, x.ord
from (values
('The crisp first draft','the-crisp-first-draft','Turn a loose idea into a confident draft with a voice people want to finish.','writing','text',array['ChatGPT','Claude'],array['writing','drafting','voice'],true,true,1),
('Weekly signal scan','weekly-signal-scan','Turn scattered updates into a focused weekly leadership brief.','business','text',array['ChatGPT','Gemini'],array['strategy','leadership'],false,true,2),
('Brand personality workshop','brand-personality-workshop','Find a memorable verbal identity before writing the tagline.','growth','text',array['ChatGPT','Claude'],array['brand','positioning'],true,true,3),
('Scene from a feeling','scene-from-a-feeling','Translate a mood into an art-directed image-generation brief.','image-studio','image',array['Midjourney','DALL·E'],array['cinematic','mood'],true,true,4),
('Debugging detective','debugging-detective','Get from mysterious error to smallest safe fix.','code','text',array['ChatGPT','Cursor'],array['debugging','engineering'],false,true,5),
('Lesson that sticks','lesson-that-sticks','Build a lesson plan around recall, practice, and an aha moment.','writing','text',array['ChatGPT','Claude'],array['learning','teaching'],false,false,6),
('Career story builder','career-story-builder','Shape accomplishments into a human interview narrative.','career','text',array['ChatGPT'],array['career','interview'],false,false,7),
('Animated micro-world','animated-micro-world','Design a looping moment with purposeful movement and charm.','image-studio','image',array['Runway','Pika'],array['animation','motion'],false,false,8),
('Social series architect','social-series-architect','Plan posts that compound into a recognizable point of view.','growth','text',array['ChatGPT','Claude'],array['social','calendar'],false,false,9),
('Friendly explainer','friendly-explainer','Explain a difficult idea without flattening the interesting parts.','writing','text',array['ChatGPT','Gemini'],array['explainer','clarity'],false,false,10),
('Customer interview guide','customer-interview-guide','Write questions that reveal behavior, not polite opinions.','business','text',array['ChatGPT'],array['research','customers'],false,false,11),
('Illustration recipe','illustration-recipe','Art direct a distinct editorial illustration from a seed idea.','image-studio','image',array['Midjourney','Adobe Firefly'],array['illustration','editorial'],false,false,12),
('Naming playground','naming-playground','Generate names with a point of view and pressure-test them.','creative','text',array['ChatGPT','Claude'],array['naming','brand'],false,false,13),
('Refactor map','refactor-map','Plan a safe refactor that protects behavior.','code','text',array['Cursor','ChatGPT'],array['refactoring','architecture'],false,false,14),
('Focus reset','focus-reset','Choose the next important move when every task feels urgent.','business','text',array['ChatGPT'],array['productivity','planning'],false,false,15),
('Short film treatment','short-film-treatment','Develop a premise into a coherent short-film treatment.','creative','text',array['ChatGPT','Claude'],array['film','story'],false,false,16),
('Launch message maker','launch-message-maker','Write a launch message that earns attention without shouting.','growth','text',array['ChatGPT','Claude'],array['launch','marketing'],false,false,17),
('Code review companion','code-review-companion','Review a change for risk, clarity, and accessibility.','code','text',array['ChatGPT','Cursor'],array['review','quality'],false,false,18),
('Creative constraint generator','creative-constraint-generator','Find a constraint that makes a blank page smaller.','creative','text',array['ChatGPT'],array['creativity','ideation'],false,false,19),
('Portfolio polish','portfolio-polish','Give a case study a clearer story, evidence, and ending.','career','text',array['ChatGPT','Claude'],array['portfolio','career'],false,false,20)
) as x(title,slug,description,category_slug,kind,tools,tags,featured,is_new,ord) join public.categories c on c.slug = x.category_slug;
