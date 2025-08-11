import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- ÍCONES SVG (não precisa instalar nada, são componentes React) ---
const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m0 0a7.5 7.5 0 007.5-7.5H4.5a7.5 7.5 0 007.5 7.5z" />
    </svg>
);

const ClipboardListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

// --- FUNÇÃO HELPER PARA CARREGAR SCRIPTS DINAMICAMENTE ---
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            return resolve();
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Falha ao carregar o script: ${src}`));
        document.head.appendChild(script);
    });
};

// --- DADOS MOCK (Agora com nome e categoria) ---
const INGREDIENT_OPTIONS = [
    { name: "Abacate", category: "hortifruti" },
    { name: "Abacate Maduro", category: "hortifruti" },
    { name: "Abacaxi", category: "hortifruti" },
    { name: "Abobrinha", category: "hortifruti" },
    { name: "Abóbora Moranga", category: "hortifruti" },
    { name: "Abóbora Cabotiá", category: "hortifruti" },
    { name: "Abóbora Manteiga", category: "hortifruti" },
    { name: "Açafrão Da Terra/Cúrcuma", category: "secos" },
    { name: "Açafrão Em Pó", category: "secos" },
    { name: "Açúcar", category: "secos" },
    { name: "Açúcar Branco", category: "secos" },
    { name: "Açúcar Cristal", category: "secos" },
    { name: "Açúcar De Confeiteiro", category: "secos" },
    { name: "Açúcar Glace", category: "secos" },
    { name: "Açúcar Mascavo", category: "secos" },
    { name: "Açúcar Refinado", category: "secos" },
    { name: "Ácido Cítrico", category: "doces e sobremesas" },
    { name: "Alcaparra", category: "hortifruti" },
    { name: "Alcatra Moída", category: "proteínas" },
    { name: "Alcatra Ou Lombo De Cordeiro", category: "proteínas" },
    { name: "Alecrim", category: "temperos" },
    { name: "Alecrim Fresco", category: "temperos" },
    { name: "Alecrim In Natura", category: "temperos" },
    { name: "Alecrim Seco", category: "temperos" },
    { name: "Alface", category: "hortifruti" },
    { name: "Alface Americana", category: "hortifruti" },
    { name: "Alface Lisa", category: "hortifruti" },
    { name: "Alho", category: "hortifruti" },
    { name: "Alho-Poró", category: "hortifruti" },
    { name: "Amêndoas", category: "secos" },
    { name: "Amêndoas Descascadas", category: "secos" },
    { name: "Amendoim", category: "secos" },
    { name: "Amendoim Descascado", category: "secos" },
    { name: "Amendoim Descascado E Sem Sal", category: "secos" },
    { name: "Amido De Milho", category: "secos" },
    { name: "Arroz Arbório (Ou Outro Para Risoto)", category: "secos" },
    { name: "Arroz Branco", category: "secos" },
    { name: "Arroz Branco Parbolizado", category: "secos" },
    { name: "Arroz Da Terra", category: "secos" },
    { name: "Atum", category: "proteínas" },
    { name: "Atum Em Conserva", category: "outros" },
    { name: "Azeite", category: "óleos e azeites" },
    { name: "Azeite De Dendê", category: "óleos e azeites" },
    { name: "Azeite De Oliva", category: "óleos e azeites" },
    { name: "Azeite De Oliva Extra Virgem", category: "óleos e azeites" },
    { name: "Azeitona", category: "hortifruti" },
    { name: "Azeitona Preta", category: "hortifruti" },
    { name: "Azeitona Verde", category: "hortifruti" },
    { name: "Bacalhau", category: "proteínas" },
    { name: "Bacon", category: "proteínas" },
    { name: "Banana Maça", category: "hortifruti" },
    { name: "Banana Nanica", category: "hortifruti" },
    { name: "Banana Da Terra/Pacovan", category: "hortifruti" },
    { name: "Banana Prata", category: "hortifruti" },
    { name: "Batata Doce", category: "hortifruti" },
    { name: "Batata Inglesa", category: "hortifruti" },
    { name: "Batata Palha", category: "secos" },
    { name: "Baunilha", category: "doces e sobremesas" },
    { name: "Berinjela", category: "hortifruti" },
    { name: "Beterraba", category: "hortifruti" },
    { name: "Bicarbonato De Sódio", category: "secos" },
    { name: "Biscoito Champagne", category: "secos" },
    { name: "Bolacha Maisena", category: "secos" },
    { name: "Brócolis", category: "hortifruti" },
    { name: "Café Em Pó", category: "bebidas" },
    { name: "Café Em Grãos", category: "bebidas" },
    { name: "Café Solúvel", category: "bebidas" },
    { name: "Cajá", category: "hortifruti" },
    { name: "Caldo Knor De Legumes", category: "outros" },
    { name: "Camarão Seco", category: "proteínas" },
    { name: "Camarão Rosa", category: "proteínas" },
    { name: "Canela Em Pó", category: "temperos" },
    { name: "Canela Em Pau", category: "temperos" },
    { name: "Canjica", category: "secos" },
    { name: "Cardamomo", category: "temperos" },
    { name: "Carne De Charque", category: "proteínas" },
    { name: "Carne De Sol", category: "proteínas" },
    { name: "Carne Seca", category: "proteínas" },
    { name: "Castanha De Caju", category: "secos" },
    { name: "Castanha Do Pará", category: "secos" },
    { name: "Cebola Branca", category: "hortifruti" },
    { name: "Cebola Roxa", category: "hortifruti" },
    { name: "Cebolinha", category: "hortifruti" },
    { name: "Cenoura", category: "hortifruti" },
    { name: "Cerveja", category: "bebidas" },
    { name: "Cerveja Preta", category: "bebidas" },
    { name: "Champignon Em Conserva", category: "outros" },
    { name: "Cheiro Verde", category: "hortifruti" },
    { name: "Chocolate Comum", category: "doces e sobremesas" },
    { name: "Chocolate Amargo", category: "doces e sobremesas" },
    { name: "Chocolate Em Pó", category: "doces e sobremesas" },
    { name: "Chocolate 50%/Meio Amargo", category: "doces e sobremesas" },
    { name: "Chocolate 70%", category: "doces e sobremesas" },
    { name: "Chocolate 80%", category: "doces e sobremesas" },
    { name: "Chuchu", category: "hortifruti" },
    { name: "Coentro", category: "hortifruti" },
    { name: "Cointreau", category: "bebidas" },
    { name: "Cominho", category: "temperos" },
    { name: "Contra Filé Moído", category: "proteínas" },
    { name: "Copa Lombo", category: "proteínas" },
    { name: "Costela Bovina", category: "proteínas" },
    { name: "Couve", category: "hortifruti" },
    { name: "Couve-Flor", category: "hortifruti" },
    { name: "Cravo Da Índia", category: "temperos" },
    { name: "Creme De Leite", category: "laticínios" },
    { name: "Creme De Leite Fresco", category: "laticínios" },
    { name: "Damasco", category: "hortifruti" },
    { name: "Doce De Leite", category: "doces e sobremesas" },
    { name: "Erva Doce", category: "temperos" },
    { name: "Ervilha Em Conserva", category: "outros" },
    { name: "Ervilha Fresca", category: "hortifruti" },
    { name: "Espinafre", category: "hortifruti" },
    { name: "Extrato De Tomate", category: "outros" },
    { name: "Farinha De Mandioca", category: "secos" },
    { name: "Farinha De Rosca", category: "secos" },
    { name: "Farinha De Trigo", category: "secos" },
    { name: "Feijão Fradinho", category: "secos" },
    { name: "Feijão Carioca", category: "secos" },
    { name: "Feijão Preto", category: "secos" },
    { name: "Feijão Branco", category: "secos" },
    { name: "Feijão Verde", category: "secos" },
    { name: "Fermento Biológico Seco", category: "secos" },
    { name: "Fermento Biológico Fresco", category: "secos" },
    { name: "Fermento Em Pó", category: "secos" },
    { name: "Filé Mignon", category: "proteínas" },
    { name: "Folhas De Louro", category: "temperos" },
    { name: "Miúdos De Frango", category: "proteínas" },
    { name: "Coxa De Frango", category: "proteínas" },
    { name: "Sobrecoxa De Frango", category: "proteínas" },
    { name: "Peito De Frango", category: "proteínas" },
    { name: "Filé De Peito De Frango", category: "proteínas" },
    { name: "Asa De Frango", category: "proteínas" },
    { name: "Meio Aa Asa De Frango", category: "proteínas" },
    { name: "Frutas Vermelhas", category: "hortifruti" },
    { name: "Gelatina Sem Sabor E Incolor", category: "doces e sobremesas" },
    { name: "Gengibre", category: "hortifruti" },
    { name: "Gergelim", category: "secos" },
    { name: "Gergelim Branco", category: "secos" },
    { name: "Goiaba", category: "hortifruti" },
    { name: "Goiabada Cascão", category: "secos" },
    { name: "Grão De Bico", category: "secos" },
    { name: "Graviola", category: "hortifruti" },
    { name: "Hortelã", category: "hortifruti" },
    { name: "Iogurte", category: "laticínios" },
    { name: "Iogurte Natural", category: "laticínios" },
    { name: "Jerimum", category: "hortifruti" },
    { name: "Laranja", category: "hortifruti" },
    { name: "Leite Condensado", category: "laticínios" },
    { name: "Leite De Coco", category: "laticínios" },
    { name: "Leite Desnatado", category: "laticínios" },
    { name: "Leite Em Pó", category: "laticínios" },
    { name: "Leite Integral", category: "laticínios" },
    { name: "Leite Semiesnatado", category: "laticínios" },
    { name: "Lentilha", category: "hortifruti" },
    { name: "Lentilha Em Conserva", category: "outros" },
    { name: "Liga Neutra", category: "doces e sobremesas" },
    { name: "Limão", category: "hortifruti" },
    { name: "Linguiça de Porco", category: "proteínas" },
    { name: "Linguiça Calabresa", category: "proteínas" },
    { name: "Linguiça De Frango", category: "proteínas" },
    { name: "Linguiça Paio", category: "proteínas" },
    { name: "Macarrão", category: "secos" },
    { name: "Macarrão Integral", category: "secos" },
    { name: "Macaxeira", category: "hortifruti" },
    { name: "Maionese", category: "outros" },
    { name: "Manjericão", category: "hortifruti" },
    { name: "Manteiga", category: "laticínios" },
    { name: "Manteiga De Garrafa", category: "laticínios" },
    { name: "Maracujá", category: "hortifruti" },
    { name: "Margarina", category: "laticínios" },
    { name: "Mel", category: "doces e sobremesas" },
    { name: "Milho", category: "hortifruti" },
    { name: "Milho De Pipoca", category: "secos" },
    { name: "Milho Verde", category: "hortifruti" },
    { name: "Molho De Pimenta", category: "molhos" },
    { name: "Molho De Soja", category: "molhos" },
    { name: "Molho Inglês", category: "molhos" },
    { name: "Molho Shoyu", category: "molhos" },
    { name: "Morango", category: "hortifruti" },
    { name: "Mortadela", category: "proteínas" },
    { name: "Mostarda", category: "molhos" },
    { name: "Mostarda Dijon", category: "molhos" },
    { name: "Nata", category: "laticínios" },
    { name: "Noz-Moscada", category: "temperos" },
    { name: "Óleo", category: "óleos e azeites" },
    { name: "Óleo De Soja", category: "óleos e azeites" },
    { name: "Orégano", category: "temperos" },
    { name: "Ovo", category: "proteínas" },
    { name: "Ovo De Codorna", category: "proteínas" },
    { name: "Páprica", category: "temperos" },
    { name: "Páprica Doce", category: "temperos" },
    { name: "Queijo Parmesão", category: "laticínios" },
    { name: "Patinho Moído", category: "proteínas" },
    { name: "Pectina", category: "outros" },
    { name: "Peito De Frango Sem Osso", category: "proteínas" },
    { name: "Peito De Peru", category: "proteínas" },
    { name: "Pepino", category: "hortifruti" },
    { name: "Pimenta", category: "temperos" },
    { name: "Pimenta Calabresa", category: "temperos" },
    { name: "Pimenta Do Reino", category: "temperos" },
    { name: "Pimenta Do Reino Branca", category: "temperos" },
    { name: "Pimenta Do Reino Moida", category: "secos" },
    { name: "Pimenta Do Reino Branca Moida", category: "secos" },
    { name: "Pimentão Amarelo", category: "hortifruti" },
    { name: "Pimentão Vermelho", category: "hortifruti" },
    { name: "Pimentão Verde", category: "hortifruti" },
    { name: "Pinhões", category: "hortifruti" },
    { name: "Polpa De Cajá", category: "outros" },
    { name: "Polpa De Maracujá", category: "outros" },
    { name: "Polpa De Morango", category: "outros" },
    { name: "Polpa De Tomate", category: "outros" },
    { name: "Polvilho Azedo", category: "secos" },
    { name: "Polvilho Doce", category: "secos" },
    { name: "Posta De Salmão", category: "proteínas" },
    { name: "Presunto", category: "proteínas" },
    { name: "Queijo Coalho", category: "laticínios" },
    { name: "Queijo De Cabra", category: "proteínas" },
    { name: "Queijo Mussarela", category: "laticínios" },
    { name: "Queijo Brie", category: "laticínios" },
    { name: "Queijo Parmesão", category: "laticínios" },
    { name: "Queijo Gorgonzola", category: "laticínios" },
    { name: "Queijo Gruyere", category: "laticínios" },
    { name: "Queijo Manteiga ", category: "laticínios" },
    { name: "Queijo Mussarela de Búfalo", category: "laticínios" },
    { name: "Queijo Minas Meia Cura", category: "laticínios" },
    { name: "Queijo Pecorino", category: "laticínios" },
    { name: "Queijo Grana Padano", category: "laticínios" },
    { name: "Queijo Marcapone", category: "laticínios" },
    { name: "Queijo Cream Cheese", category: "laticínios" },
    { name: "Quiabo", category: "hortifruti" },
    { name: "Repolho", category: "hortifruti" },
    { name: "Requeijão", category: "laticínios" },
    { name: "Ricota", category: "laticínios" },
    { name: "Rúcula", category: "hortifruti" },
    { name: "Sal", category: "temperos" },
    { name: "Sal Grosso", category: "temperos" },
    { name: "Salsa", category: "hortifruti" },
    { name: "Salsão", category: "hortifruti" },
    { name: "Salsicha", category: "hortifruti" }, 
    { name: "Suco De Laranja", category: "bebidas" },
    { name: "Suco De Limão", category: "bebidas" },
    { name: "Tapioca", category: "secos" },
    { name: "Tomate", category: "hortifruti" },
    { name: "Tomate Cereja", category: "hortifruti" },
    { name: "Tomilho", category: "temperos" },
    { name: "Trigo Para Kibe", category: "secos" },
    { name: "Uva Passa", category: "hortifruti" },
    { name: "Uvas Passas Brancas", category: "hortifruti" },
    { name: "Vagem Fresca", category: "hortifruti" },
    { name: "Vinagre", category: "outros" },
    { name: "Vinagre De Cidra", category: "outros" },
    { name: "Vinho Branco", category: "bebidas" },
    { name: "Vinho Tinto", category: "bebidas" }
];

const UNIT_OPTIONS = [ "g", "kg", "ml", "L", "unidade(s)", "molho" ];

// --- NOVO COMPONENTE: COMBOBOX PESQUISÁVEL ---
const ComboBox = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const filteredOptions = useMemo(() =>
        value ? options.filter(option =>
            option.name.toLowerCase().includes(value.toLowerCase())
        ) : options,
    [options, value]);

    // Hook para fechar o dropdown se clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {isOpen && (
                // CORREÇÃO: Aumentado o z-index para garantir que fique por cima
                <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    onChange(option.name);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                            >
                                {option.name}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-gray-500">Nenhuma opção encontrada</li>
                    )}
                </ul>
            )}
        </div>
    );
};

// CORRIGIDO: Componente Accordion para permitir que o dropdown flutue
const Accordion = ({ title, children, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    return (
        // CORREÇÃO: Adicionado 'relative' para criar um contexto de empilhamento
        <div className="border-b border-gray-200 relative">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left text-gray-800 bg-gray-50 hover:bg-gray-100 focus:outline-none">
                <h3 className="font-semibold text-lg">{title}</h3>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}> <ChevronDownIcon /> </span>
            </button>
            {/* CORREÇÃO: Troca 'overflow-hidden' por 'overflow-visible' quando o accordion está aberto */}
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen overflow-visible' : 'max-h-0 overflow-hidden'}`}>
                <div className="p-4 bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE: TELA DE CADASTRO (MENU "DISCIPLINAS") ---
const SetupScreen = ({ profileData, setProfileData, onSave }) => {
    const [errors, setErrors] = useState({});

    const handleDataChange = (field, value) => setProfileData(prev => ({ ...prev, [field]: value }));
    const handleDisciplineChange = (discIndex, field, value) => {
        const updatedDisciplines = [...profileData.disciplines];
        updatedDisciplines[discIndex][field] = value;
        handleDataChange('disciplines', updatedDisciplines);
    };
    const handleLessonChange = (discIndex, lessonIndex, field, value) => {
        const updatedDisciplines = [...profileData.disciplines];
        updatedDisciplines[discIndex].aulas[lessonIndex][field] = value;
        handleDataChange('disciplines', updatedDisciplines);
    };
    const addDiscipline = () => handleDataChange('disciplines', [...profileData.disciplines, { id: Date.now(), name: 'Nova Disciplina', aulas: [{ id: Date.now(), name: 'Aula 01', date: '' }] }]);
    const removeDiscipline = (discIndex) => handleDataChange('disciplines', profileData.disciplines.filter((_, i) => i !== discIndex));
    const addLesson = (discIndex) => {
        const updatedDisciplines = [...profileData.disciplines];
        const nextLessonNumber = updatedDisciplines[discIndex].aulas.length + 1;
        const formattedNumber = nextLessonNumber < 10 ? `0${nextLessonNumber}` : `${nextLessonNumber}`;
        updatedDisciplines[discIndex].aulas.push({ id: Date.now(), name: `Aula ${formattedNumber}`, date: '' });
        handleDataChange('disciplines', updatedDisciplines);
    };
    const removeLesson = (discIndex, lessonIndex) => {
        const updatedDisciplines = [...profileData.disciplines];
        updatedDisciplines[discIndex].aulas = updatedDisciplines[discIndex].aulas.filter((_, i) => i !== lessonIndex);
        updatedDisciplines[discIndex].aulas = updatedDisciplines[discIndex].aulas.map((aula, idx) => {
            const formattedNumber = (idx + 1) < 10 ? `0${idx + 1}` : `${idx + 1}`;
            return { ...aula, name: `Aula ${formattedNumber}` };
        });
        handleDataChange('disciplines', updatedDisciplines);
    };

    const validateAndSave = () => {
        const newErrors = {};
        if (!profileData.professorName.trim()) newErrors.professorName = "O nome do professor é obrigatório.";
        if (profileData.disciplines.length === 0) newErrors.disciplines = "Adicione pelo menos uma disciplina.";
        else if (profileData.disciplines.some(d => !d.name.trim() || d.aulas.length === 0 || d.aulas.some(a => !a.name.trim()))) {
            newErrors.disciplines = "Toda disciplina e aula devem ter um nome.";
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onSave();
        }
    };

    return (
        <div className="space-y-8">
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Dados do Professor</h2>
                <div className="flex flex-col">
                    <label htmlFor="professorName" className="mb-2 font-semibold text-gray-700">Nome do Professor <span className="text-red-500">*</span></label>
                    <input id="professorName" type="text" value={profileData.professorName} onChange={(e) => handleDataChange('professorName', e.target.value)} placeholder="Digite o nome do professor" className={`p-2 border rounded-md shadow-sm ${errors.professorName ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500`} />
                    {errors.professorName && <p className="text-red-500 text-sm mt-1">{errors.professorName}</p>}
                </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Disciplinas e Aulas</h2>
                    <button onClick={addDiscipline} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"> <PlusIcon /> Adicionar Disciplina </button>
                </div>
                {errors.disciplines && <p className="text-red-500 text-sm mb-4">{errors.disciplines}</p>}
                <div className="space-y-6">
                    {profileData.disciplines.map((discipline, discIndex) => (
                        <div key={discipline.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                            <div className="flex items-center gap-4">
                                <input type="text" value={discipline.name} onChange={(e) => handleDisciplineChange(discIndex, 'name', e.target.value)} placeholder="Nome da Disciplina" className="flex-grow p-2 text-lg font-semibold border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                <button onClick={() => removeDiscipline(discIndex)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"> <TrashIcon /> </button>
                            </div>
                            <div className="pl-4 space-y-2">
                                <h4 className="font-semibold text-gray-600">Aulas</h4>
                                {discipline.aulas.map((aula, lessonIndex) => (
                                    <div key={aula.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                        <div className="flex-grow p-2 border border-gray-200 rounded-md bg-gray-100 text-gray-700">{aula.name}</div>
                                        <input type="date" value={aula.date} onChange={(e) => handleLessonChange(discIndex, lessonIndex, 'date', e.target.value)} className="p-2 border border-gray-200 rounded-md"/>
                                        <button onClick={() => removeLesson(discIndex, lessonIndex)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"> <TrashIcon /> </button>
                                    </div>
                                ))}
                                <button onClick={() => addLesson(discIndex)} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-semibold mt-2"> <PlusIcon /> Adicionar Aula </button>
                            </div>
                        </div>
                    ))}
                    {profileData.disciplines.length === 0 && <p className="text-center text-gray-500 py-4">Nenhuma disciplina cadastrada.</p>}
                </div>
            </div>
            <div className="flex justify-end mt-8">
                <button onClick={validateAndSave} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-transform transform hover:scale-105">
                    Salvar e Ir para Listas
                </button>
            </div>
        </div>
    );
};

// --- COMPONENTE: TELA DE LISTAS DE INGREDIENTES (MENU "LISTAS DE PEDIDOS") ---
const IngredientsScreen = ({ profileData, setProfileData }) => {
    const handleIngredientChange = (dIdx, aIdx, iIdx, field, value) => {
        const updated = [...profileData.disciplines];
        updated[dIdx].aulas[aIdx].ingredients[iIdx][field] = value;
        setProfileData(prev => ({ ...prev, disciplines: updated }));
    };
    const addIngredient = (dIdx, aIdx) => {
        const newIngredient = { id: Date.now(), name: '', quantity: '', unit: '', obs: '' };
        const updated = [...profileData.disciplines];
        if (!updated[dIdx].aulas[aIdx].ingredients) updated[dIdx].aulas[aIdx].ingredients = [];
        updated[dIdx].aulas[aIdx].ingredients.push(newIngredient);
        setProfileData(prev => ({ ...prev, disciplines: updated }));
    };
    const removeIngredient = (dIdx, aIdx, iIdx) => {
        const updated = [...profileData.disciplines];
        updated[dIdx].aulas[aIdx].ingredients = updated[dIdx].aulas[aIdx].ingredients.filter((_, i) => i !== iIdx);
        setProfileData(prev => ({ ...prev, disciplines: updated }));
    };
    
    const hasValidIngredients = (aula) => {
        if (!aula.ingredients || aula.ingredients.length === 0) return false;
        return aula.ingredients.some(ing => ing.name && ing.quantity && ing.unit);
    };
    
    const handleExportXLSX = (discipline, aula) => {
        if (!hasValidIngredients(aula)) return;
        const categoryMap = new Map(INGREDIENT_OPTIONS.map(opt => [opt.name, opt.category]));
        const data = (aula.ingredients || []).filter(ing => ing.name && ing.quantity && ing.unit).map(ing => ({
            "Nome do Ingrediente": ing.name,
            "Categoria": categoryMap.get(ing.name) || "N/A",
            "Quantidade": ing.quantity,
            "Unid.": ing.unit,
            "Observações": ing.obs || ""
        }));
        const date = aula.date ? new Date(aula.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'sem-data';
        const fileName = `Pedido_${date}_${discipline.name}_${aula.name}.xlsx`;
        loadScript('https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js').then(() => {
            const XLSX = window.XLSX;
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Ingredientes');
            XLSX.writeFile(wb, fileName);
        }).catch(error => console.error("Falha ao carregar script do XLSX:", error));
    };
    
    const handleExportPDF = (discipline, aula) => {
        if (!hasValidIngredients(aula)) return;
        const ingredients = (aula.ingredients || []).filter(ing => ing.name && ing.quantity && ing.unit).map(ing => ({ name: ing.name, quantity: ing.quantity, unit: ing.unit, obs: ing.obs || "" }));
        const date = aula.date ? new Date(aula.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Sem data';
        const fileName = `Lista_${discipline.name}_${aula.name}.pdf`;
        
        Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
            // CORREÇÃO: Usando uma versão do plugin autotable conhecida por ser estável com carregamento de script
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js')
        ]).then(() => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(16);
            doc.text(`Lista de Ingredientes`, 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Professor(a): ${profileData.professorName}`, 14, 32);
            doc.text(`Disciplina: ${discipline.name}`, 14, 38);
            doc.text(`Aula: ${aula.name} - Data: ${date}`, 14, 44);

            const tableColumn = ["Nome do Ingrediente", "Quantidade", "Unid.", "Observações"];
            const tableRows = ingredients.map(ing => [ing.name, ing.quantity, ing.unit, ing.obs]);

            // A chamada doc.autoTable() agora deve funcionar corretamente
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 55,
                theme: 'grid',
            });

            doc.save(fileName);
        }).catch(error => console.error("Falha ao carregar scripts do PDF:", error));
    };
    
    return (
        <div className="bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text--800 p-6 border-b ">Listas de Pedidos</h2>
            <div className="space-y-1">
                {profileData.disciplines.map((discipline, dIdx) => (
                    <Accordion key={discipline.id} title={discipline.name}>
                        <div className="space-y-2">
                            {discipline.aulas.map((aula, aIdx) => (
                                <Accordion key={aula.id} title={`${aula.name} - ${aula.date ? new Date(aula.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Sem data'}`}>
                                    <div className="space-y-4">
                                        <div className="flex justify-end space-x-2 mb-4">
                                            <button onClick={() => handleExportXLSX(discipline, aula)} disabled={!hasValidIngredients(aula)} className={`px-4 py-2 rounded-lg shadow-md text-white font-semibold ${hasValidIngredients(aula) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}>Exportar Pedido (.xlsx)</button>
                                            <button onClick={() => handleExportPDF(discipline, aula)} disabled={!hasValidIngredients(aula)} className={`px-4 py-2 rounded-lg shadow-md text-white font-semibold ${hasValidIngredients(aula) ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}>Exportar Lista (.pdf)</button>
                                        </div>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                                                         <div className="flex items-center space-x-2">
                                                            <span>Ingrediente</span>
                                                            <span className="text-xs text-yellow-600 normal-case font-normal">
                                                            💡 Sempre opte por selecionar um ingrediente listado
                                                            </span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Qtd.</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Unid.</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Obs.</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {(aula.ingredients || []).map((ing, iIdx) => (
                                                    <tr key={ing.id}>
                                                        <td className="px-2 py-2">
                                                            <ComboBox options={INGREDIENT_OPTIONS} value={ing.name} onChange={(val) => handleIngredientChange(dIdx, aIdx, iIdx, 'name', val)} placeholder="Ex: Farinha"/>
                                                        </td>
                                                        <td className="px-2 py-2"><input type="number" value={ing.quantity} onChange={(e) => handleIngredientChange(dIdx, aIdx, iIdx, 'quantity', e.target.value)} placeholder="Ex: 100" className="w-full p-2 border border-gray-300 rounded-md"/></td>
                                                        <td className="px-2 py-2">
                                                            <select value={ing.unit} onChange={(e) => handleIngredientChange(dIdx, aIdx, iIdx, 'unit', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                                                <option value="">Selecione</option>
                                                                {UNIT_OPTIONS.map((unit, index) => (<option key={index} value={unit}>{unit}</option>))}
                                                            </select>
                                                        </td>
                                                        <td className="px-2 py-2"><input type="text" value={ing.obs} onChange={(e) => handleIngredientChange(dIdx, aIdx, iIdx, 'obs', e.target.value)} placeholder="Ex: Peneirada" className="w-full p-2 border border-gray-300 rounded-md"/></td>
                                                        <td className="px-2 py-2 text-right"><button onClick={() => removeIngredient(dIdx, aIdx, iIdx)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon /></button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <button onClick={() => addIngredient(dIdx, aIdx)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"><PlusIcon /> Adicionar Ingrediente</button>
                                    </div>
                                </Accordion>
                            ))}
                        </div>
                    </Accordion>
                ))}
            </div>
        </div>
    );
};

// --- COMPONENTE: MENU LATERAL ---
const SideMenu = ({ activeMenu, setActiveMenu, isSetupComplete }) => {
    const MenuItem = ({ menuName, label, icon }) => {
        const isActive = activeMenu === menuName;
        const isDisabled = menuName === 'pedidos' && !isSetupComplete;
        const baseClasses = "flex items-center w-full px-4 py-3 text-left text-lg font-semibold transition-colors duration-200 rounded-lg";
        const activeClasses = "bg-indigo-700 text-white";
        const inactiveClasses = "text-indigo-100 hover:bg-indigo-500 hover:text-white";
        const disabledClasses = "text-indigo-300 opacity-50 cursor-not-allowed";
        return (
            <button onClick={() => !isDisabled && setActiveMenu(menuName)} disabled={isDisabled} className={`${baseClasses} ${isDisabled ? disabledClasses : (isActive ? activeClasses : inactiveClasses)}`}>
                {icon}
                {label}
            </button>
        );
    };
    return (
        <aside className="w-64 bg-indigo-800 text-white p-4 flex flex-col flex-shrink-0">
            <h1 className="text-2xl font-bold text-center mb-10 mt-2">Menu Principal</h1>
            <nav className="flex flex-col space-y-3">
                <MenuItem menuName="disciplinas" label="Disciplinas" icon={<BookOpenIcon />} />
                <MenuItem menuName="pedidos" label="Listas de Pedidos" icon={<ClipboardListIcon />} />
            </nav>
        </aside>
    );
};

// --- COMPONENTE PRINCIPAL DA APLICAÇÃO ---
export default function App() {
    const [activeMenu, setActiveMenu] = useState('disciplinas');
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [profileData, setProfileData] = useState({ professorName: '', disciplines: [] });

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('gastronomyAppData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setProfileData(parsedData);
                if (parsedData.professorName && parsedData.disciplines.length > 0 && parsedData.disciplines.every(d => d.aulas.length > 0)) {
                    setIsSetupComplete(true);
                    setActiveMenu('pedidos');
                }
            }
        } catch (error) { console.error("Falha ao carregar dados do localStorage:", error); }
    }, []);

    useEffect(() => {
        try {
            if (profileData.professorName || profileData.disciplines.length > 0) {
                 localStorage.setItem('gastronomyAppData', JSON.stringify(profileData));
            }
        } catch (error) { console.error("Falha ao salvar dados no localStorage:", error); }
    }, [profileData]);

    const handleSetupSave = () => {
        setIsSetupComplete(true);
        setActiveMenu('pedidos');
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <SideMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} isSetupComplete={isSetupComplete} />
            <main className="flex-1 p-8 overflow-y-auto">
                {activeMenu === 'disciplinas' && (
                    <SetupScreen profileData={profileData} setProfileData={setProfileData} onSave={handleSetupSave} />
                )}
                {activeMenu === 'pedidos' && isSetupComplete && (
                    <IngredientsScreen profileData={profileData} setProfileData={setProfileData} />
                )}
            </main>
        </div>
    );
}