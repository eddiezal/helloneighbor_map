import { useState, useEffect, useMemo } from 'react';
import { Producer } from '../types/Producer.types';
import { mockProducers } from '../data/mockProducers';

export type SortOption = 'distance' | 'rating' | 'reviews' | 'name' | 'availability';

interface UsePro