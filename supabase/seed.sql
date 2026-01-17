-- Script de seed data pour les données initiales
-- À exécuter après la création des tables

-- Assurez-vous que les animations sont insérées (déjà dans schema.sql, mais au cas où)
INSERT INTO public.animations (id, name, type, asset_name, category_suggestion, is_premium)
VALUES
(1, 'Piggy Bank', 'fill', 'piggy-bank', 'finance', false),
(2, 'Safe', 'fill', 'safe', 'finance', false),
(3, 'Wallet', 'fill', 'wallet', 'finance', false),
(4, 'Biceps', 'grow', 'biceps', 'sport', false),
(5, 'Runner', 'speed', 'runner', 'sport', false),
(6, 'Flame', 'intensity', 'flame', 'sport', false),
(7, 'Plant', 'grow', 'plant', 'lifestyle', false),
(8, 'Water Glass', 'fill', 'water-glass', 'nutrition', false),
(9, 'Heart', 'pulse', 'heart', 'health', false),
(10, 'Book Stack', 'stack', 'book-stack', 'education', false),
(11, 'Trophy', 'reveal', 'trophy', 'general', false),
(12, 'Mountain', 'climb', 'mountain', 'general', false)
ON CONFLICT (id) DO NOTHING;
