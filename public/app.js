// --- CONFIGURATION ---
function getLevel(wins) {
    if (wins >= 200) return { name: "Gran Alquimista", emoji: "🧙", color: "#ff00ff" };
    if (wins >= 150) return { name: "Maestro de Síntesis", emoji: "🧫", color: "#ff8800" };
    if (wins >= 100) return { name: "Analista Químico", emoji: "🔬", color: "#00d2ff" };
    if (wins >= 50) return { name: "Técnico en Reacciones", emoji: "⚗️", color: "#00ff88" };
    return { name: "Ayudante de Laboratorio", emoji: "🥼", color: "#ffffff" };
}
// Firebase backend removido, se utiliza Appwrite en appwrite-auth.js y appwrite-rooms.js

const EQUATIONS_BANK = [
    // --- EASY (100) ---
    { reactants: ["H2","O2"], products: ["H2O"] },
    { reactants: ["N2","H2"], products: ["NH3"] },
    { reactants: ["Mg","O2"], products: ["MgO"] },
    { reactants: ["Na","Cl2"], products: ["NaCl"] },
    { reactants: ["K","I2"], products: ["KI"] },
    { reactants: ["C","O2"], products: ["CO"] },
    { reactants: ["S","O2"], products: ["SO2"] },
    { reactants: ["Fe","Cl2"], products: ["FeCl3"] },
    { reactants: ["Ca","O2"], products: ["CaO"] },
    { reactants: ["P","O2"], products: ["P2O5"] },
    { reactants: ["Li","O2"], products: ["Li2O"] },
    { reactants: ["Be","Cl2"], products: ["BeCl2"] },
    { reactants: ["B","O2"], products: ["B2O3"] },
    { reactants: ["HgO"], products: ["Hg","O2"] },
    { reactants: ["Ag2O"], products: ["Ag","O2"] },
    { reactants: ["NO","O2"], products: ["NO2"] },
    { reactants: ["CO","O2"], products: ["CO2"] },
    { reactants: ["N2O3","H2O"], products: ["HNO2"] },
    { reactants: ["P4","O2"], products: ["P4O10"] },
    { reactants: ["Ba","O2"], products: ["BaO"] },
    { reactants: ["Al","O2"], products: ["Al2O3"] },
    { reactants: ["Cu","O2"], products: ["CuO"] },
    { reactants: ["Zn","O2"], products: ["ZnO"] },
    { reactants: ["Sn","O2"], products: ["SnO2"] },
    { reactants: ["Pb","O2"], products: ["PbO2"] },
    { reactants: ["Si","O2"], products: ["SiO2"] },
    { reactants: ["Ti","O2"], products: ["TiO2"] },
    { reactants: ["Cr","O2"], products: ["Cr2O3"] },
    { reactants: ["Mn","O2"], products: ["MnO2"] },
    { reactants: ["Ni","O2"], products: ["NiO"] },
    { reactants: ["Co","O2"], products: ["Co2O3"] },
    { reactants: ["Ag","O2"], products: ["Ag2O"] },
    { reactants: ["Au","Cl2"], products: ["AuCl3"] },
    { reactants: ["Na","Br2"], products: ["NaBr"] },
    { reactants: ["K","Cl2"], products: ["KCl"] },
    { reactants: ["Ca","Cl2"], products: ["CaCl2"] },
    { reactants: ["Mg","Cl2"], products: ["MgCl2"] },
    { reactants: ["Al","Cl2"], products: ["AlCl3"] },
    { reactants: ["Fe","Br2"], products: ["FeBr3"] },
    { reactants: ["Zn","Cl2"], products: ["ZnCl2"] },
    { reactants: ["Cu","Cl2"], products: ["CuCl2"] },
    { reactants: ["Ba","Cl2"], products: ["BaCl2"] },
    { reactants: ["Li","Cl2"], products: ["LiCl"] },
    { reactants: ["Na","F2"], products: ["NaF"] },
    { reactants: ["K","F2"], products: ["KF"] },
    { reactants: ["Ca","F2"], products: ["CaF2"] },
    { reactants: ["Mg","Br2"], products: ["MgBr2"] },
    { reactants: ["Al","Br2"], products: ["AlBr3"] },
    { reactants: ["Zn","Br2"], products: ["ZnBr2"] },
    { reactants: ["H2","Cl2"], products: ["HCl"] },
    { reactants: ["H2","Br2"], products: ["HBr"] },
    { reactants: ["H2","F2"], products: ["HF"] },
    { reactants: ["H2","I2"], products: ["HI"] },
    { reactants: ["H2","S"], products: ["H2S"] },
    { reactants: ["N2","O2"], products: ["NO"] },
    { reactants: ["C","S"], products: ["CS2"] },
    { reactants: ["P4","Cl2"], products: ["PCl3"] },
    { reactants: ["P4","Cl2"], products: ["PCl5"] },
    { reactants: ["Fe","S"], products: ["FeS"] },
    { reactants: ["Cu","S"], products: ["Cu2S"] },
    { reactants: ["Ag","S"], products: ["Ag2S"] },
    { reactants: ["Zn","S"], products: ["ZnS"] },
    { reactants: ["Pb","S"], products: ["PbS"] },
    { reactants: ["Hg","S"], products: ["HgS"] },
    { reactants: ["CaO","H2O"], products: ["Ca(OH)2"] },
    { reactants: ["Na2O","H2O"], products: ["NaOH"] },
    { reactants: ["K2O","H2O"], products: ["KOH"] },
    { reactants: ["MgO","H2O"], products: ["Mg(OH)2"] },
    { reactants: ["BaO","H2O"], products: ["Ba(OH)2"] },
    { reactants: ["Li2O","H2O"], products: ["LiOH"] },
    { reactants: ["CO2","H2O"], products: ["H2CO3"] },
    { reactants: ["SO3","H2O"], products: ["H2SO4"] },
    { reactants: ["SO2","H2O"], products: ["H2SO3"] },
    { reactants: ["N2O5","H2O"], products: ["HNO3"] },
    { reactants: ["P4O10","H2O"], products: ["H3PO4"] },
    { reactants: ["Cl2O7","H2O"], products: ["HClO4"] },
    { reactants: ["SiO2","H2O"], products: ["H2SiO3"] },
    { reactants: ["Fe2O3"], products: ["Fe","O2"] },
    { reactants: ["CuO"], products: ["Cu","O2"] },
    { reactants: ["PbO2"], products: ["PbO","O2"] },
    { reactants: ["KNO3"], products: ["KNO2","O2"] },
    { reactants: ["Hg2Cl2"], products: ["Hg","HgCl2"] },
    { reactants: ["NaHCO3"], products: ["Na2CO3","H2O","CO2"] },
    { reactants: ["Ca(HCO3)2"], products: ["CaCO3","H2O","CO2"] },
    { reactants: ["NH4Cl"], products: ["NH3","HCl"] },
    { reactants: ["CaCO3"], products: ["CaO","CO2"] },
    { reactants: ["MgCO3"], products: ["MgO","CO2"] },
    { reactants: ["BaCO3"], products: ["BaO","CO2"] },
    { reactants: ["ZnCO3"], products: ["ZnO","CO2"] },
    { reactants: ["FeCO3"], products: ["FeO","CO2"] },
    { reactants: ["Na2CO3"], products: ["Na2O","CO2"] },
    { reactants: ["Ag2CO3"], products: ["Ag2O","CO2"] },
    { reactants: ["H2O2"], products: ["H2O","O2"] },
    { reactants: ["KClO3"], products: ["KCl","O2"] },
    { reactants: ["KClO4"], products: ["KClO3","O2"] },
    { reactants: ["Pb(NO3)2"], products: ["PbO","NO2","O2"] },
    { reactants: ["Cu(NO3)2"], products: ["CuO","NO2","O2"] },
    { reactants: ["AgNO3"], products: ["Ag","NO2","O2"] },

    // --- MEDIUM (100) ---
    { reactants: ["CH4","O2"], products: ["CO2","H2O"] },
    { reactants: ["Fe","O2"], products: ["Fe2O3"] },
    { reactants: ["Zn","HCl"], products: ["ZnCl2","H2"] },
    { reactants: ["KClO3"], products: ["KCl","O2"] },
    { reactants: ["Al","Cl2"], products: ["AlCl3"] },
    { reactants: ["C3H8","O2"], products: ["CO2","H2O"] },
    { reactants: ["NaOH","HCl"], products: ["NaCl","H2O"] },
    { reactants: ["NH4NO3"], products: ["N2O","H2O"] },
    { reactants: ["SO2","O2"], products: ["SO3"] },
    { reactants: ["Na","H2O"], products: ["NaOH","H2"] },
    { reactants: ["K","H2O"], products: ["KOH","H2"] },
    { reactants: ["Ca","H2O"], products: ["Ca(OH)2","H2"] },
    { reactants: ["C2H6","O2"], products: ["CO2","H2O"] },
    { reactants: ["C4H10","O2"], products: ["CO2","H2O"] },
    { reactants: ["Mg","HCl"], products: ["MgCl2","H2"] },
    { reactants: ["Fe","H2SO4"], products: ["FeSO4","H2"] },
    { reactants: ["Al","H2SO4"], products: ["Al2(SO4)3","H2"] },
    { reactants: ["Na2CO3","HCl"], products: ["NaCl","H2O","CO2"] },
    { reactants: ["H2SO4","NaOH"], products: ["Na2SO4","H2O"] },
    { reactants: ["Zn","AgCl"], products: ["ZnCl2","Ag"] },
    { reactants: ["BaCl2","Na2SO4"], products: ["BaSO4","NaCl"] },
    { reactants: ["AgNO3","NaCl"], products: ["AgCl","NaNO3"] },
    { reactants: ["C2H4","O2"], products: ["CO2","H2O"] },
    { reactants: ["C6H6","O2"], products: ["CO2","H2O"] },
    { reactants: ["C5H12","O2"], products: ["CO2","H2O"] },
    { reactants: ["C6H12O6","O2"], products: ["CO2","H2O"] },
    { reactants: ["Fe","HCl"], products: ["FeCl2","H2"] },
    { reactants: ["Al","NaOH","H2O"], products: ["NaAlO2","H2"] },
    { reactants: ["Cu","HNO3"], products: ["Cu(NO3)2","H2O","NO"] },
    { reactants: ["Zn","NaOH"], products: ["Na2ZnO2","H2"] },
    { reactants: ["Ca(OH)2","HCl"], products: ["CaCl2","H2O"] },
    { reactants: ["Ba(OH)2","H2SO4"], products: ["BaSO4","H2O"] },
    { reactants: ["NaOH","H2SO4"], products: ["Na2SO4","H2O"] },
    { reactants: ["KOH","HNO3"], products: ["KNO3","H2O"] },
    { reactants: ["Ca(OH)2","CO2"], products: ["CaCO3","H2O"] },
    { reactants: ["NaOH","CO2"], products: ["Na2CO3","H2O"] },
    { reactants: ["NH3","H2SO4"], products: ["(NH4)2SO4"] },
    { reactants: ["NH3","HCl"], products: ["NH4Cl"] },
    { reactants: ["NH3","HNO3"], products: ["NH4NO3"] },
    { reactants: ["FeCl3","NaOH"], products: ["Fe(OH)3","NaCl"] },
    { reactants: ["CuSO4","NaOH"], products: ["Cu(OH)2","Na2SO4"] },
    { reactants: ["AlCl3","NaOH"], products: ["Al(OH)3","NaCl"] },
    { reactants: ["ZnSO4","NaOH"], products: ["Zn(OH)2","Na2SO4"] },
    { reactants: ["Fe(OH)3"], products: ["Fe2O3","H2O"] },
    { reactants: ["Cu(OH)2"], products: ["CuO","H2O"] },
    { reactants: ["Al(OH)3"], products: ["Al2O3","H2O"] },
    { reactants: ["Zn(OH)2"], products: ["ZnO","H2O"] },
    { reactants: ["Ca(OH)2"], products: ["CaO","H2O"] },
    { reactants: ["Mg(OH)2"], products: ["MgO","H2O"] },
    { reactants: ["Fe3O4","H2"], products: ["Fe","H2O"] },
    { reactants: ["CuO","H2"], products: ["Cu","H2O"] },
    { reactants: ["Fe2O3","H2"], products: ["Fe","H2O"] },
    { reactants: ["PbO","H2"], products: ["Pb","H2O"] },
    { reactants: ["SnO2","H2"], products: ["Sn","H2O"] },
    { reactants: ["NiO","H2"], products: ["Ni","H2O"] },
    { reactants: ["CoO","H2"], products: ["Co","H2O"] },
    { reactants: ["MnO2","HCl"], products: ["MnCl2","H2O","Cl2"] },
    { reactants: ["HCl","MnO2"], products: ["MnCl2","Cl2","H2O"] },
    { reactants: ["Na2S","HCl"], products: ["NaCl","H2S"] },
    { reactants: ["FeS","HCl"], products: ["FeCl2","H2S"] },
    { reactants: ["CaC2","H2O"], products: ["Ca(OH)2","C2H2"] },
    { reactants: ["Na2O2","H2O"], products: ["NaOH","O2"] },
    { reactants: ["Na2O2","CO2"], products: ["Na2CO3","O2"] },
    { reactants: ["Cl2","NaOH"], products: ["NaCl","NaClO","H2O"] },
    { reactants: ["Fe2O3","CO"], products: ["Fe","CO2"] },
    { reactants: ["CuO","CO"], products: ["Cu","CO2"] },
    { reactants: ["SnO2","CO"], products: ["Sn","CO2"] },
    { reactants: ["ZnO","C"], products: ["Zn","CO"] },
    { reactants: ["Fe2O3","C"], products: ["Fe","CO2"] },
    { reactants: ["SiO2","C"], products: ["Si","CO"] },
    { reactants: ["SiO2","Na2CO3"], products: ["Na2SiO3","CO2"] },
    { reactants: ["SiO2","CaO"], products: ["CaSiO3"] },
    { reactants: ["Al2O3","NaOH"], products: ["NaAlO2","H2O"] },
    { reactants: ["SO3","NaOH"], products: ["Na2SO4","H2O"] },
    { reactants: ["CO2","NaOH"], products: ["Na2CO3","H2O"] },
    { reactants: ["HF","SiO2"], products: ["SiF4","H2O"] },
    { reactants: ["P4","NaOH","H2O"], products: ["NaH2PO2","PH3"] },
    { reactants: ["Cl2","H2O"], products: ["HCl","HClO"] },
    { reactants: ["F2","H2O"], products: ["HF","O2"] },
    { reactants: ["NO2","H2O","O2"], products: ["HNO3"] },
    { reactants: ["SO2","H2O","O2"], products: ["H2SO4"] },
    { reactants: ["CaO","SiO2"], products: ["CaSiO3"] },
    { reactants: ["Al2O3","H2SO4"], products: ["Al2(SO4)3","H2O"] },
    { reactants: ["Fe2O3","H2SO4"], products: ["Fe2(SO4)3","H2O"] },
    { reactants: ["CuO","H2SO4"], products: ["CuSO4","H2O"] },
    { reactants: ["ZnO","H2SO4"], products: ["ZnSO4","H2O"] },
    { reactants: ["MgO","H2SO4"], products: ["MgSO4","H2O"] },
    { reactants: ["BaO","H2SO4"], products: ["BaSO4","H2O"] },
    { reactants: ["CaO","H2SO4"], products: ["CaSO4","H2O"] },
    { reactants: ["Fe","CuSO4"], products: ["FeSO4","Cu"] },
    { reactants: ["Zn","CuSO4"], products: ["ZnSO4","Cu"] },
    { reactants: ["Mg","CuSO4"], products: ["MgSO4","Cu"] },
    { reactants: ["Al","FeSO4"], products: ["Al2(SO4)3","Fe"] },
    { reactants: ["Cu","AgNO3"], products: ["Cu(NO3)2","Ag"] },
    { reactants: ["Zn","Pb(NO3)2"], products: ["Zn(NO3)2","Pb"] },
    { reactants: ["Na2SO4","BaCl2"], products: ["BaSO4","NaCl"] },
    { reactants: ["K2CO3","HCl"], products: ["KCl","H2O","CO2"] },
    { reactants: ["Na3PO4","AgNO3"], products: ["Ag3PO4","NaNO3"] },
    { reactants: ["CaCl2","Na2CO3"], products: ["CaCO3","NaCl"] },
    { reactants: ["FeCl2","NaOH"], products: ["Fe(OH)2","NaCl"] },

    // --- ADVANCED (100) ---
    { reactants: ["FeS2","O2"], products: ["Fe2O3","SO2"] },
    { reactants: ["NH3","O2"], products: ["NO","H2O"] },
    { reactants: ["C2H5OH","O2"], products: ["CO2","H2O"] },
    { reactants: ["KMnO4"], products: ["K2MnO4","MnO2","O2"] },
    { reactants: ["Cu","HNO3"], products: ["Cu(NO3)2","NO","H2O"] },
    { reactants: ["Al4C3","H2O"], products: ["Al(OH)3","CH4"] },
    { reactants: ["Ca3P2","H2O"], products: ["Ca(OH)2","PH3"] },
    { reactants: ["WO3","H2"], products: ["W","H2O"] },
    { reactants: ["Na2CO3","HCl"], products: ["NaCl","H2O","CO2"] },
    { reactants: ["NaHCO3"], products: ["Na2CO3","H2O","CO2"] },
    { reactants: ["H2SO4","NaOH"], products: ["Na2SO4","H2O"] },
    { reactants: ["BaCl2","Na2SO4"], products: ["BaSO4","NaCl"] },
    { reactants: ["AgNO3","NaCl"], products: ["AgCl","NaNO3"] },
    { reactants: ["Pb(NO3)2"], products: ["PbO","NO2","O2"] },
    { reactants: ["C3H6","O2"], products: ["CO2","H2O"] },
    { reactants: ["C7H16","O2"], products: ["CO2","H2O"] },
    { reactants: ["C8H18","O2"], products: ["CO2","H2O"] },
    { reactants: ["C10H22","O2"], products: ["CO2","H2O"] },
    { reactants: ["C2H2","O2"], products: ["CO2","H2O"] },
    { reactants: ["C6H14","O2"], products: ["CO2","H2O"] },
    { reactants: ["KMnO4","HCl"], products: ["KCl","MnCl2","H2O","Cl2"] },
    { reactants: ["KMnO4","H2SO4","H2O2"], products: ["K2SO4","MnSO4","O2","H2O"] },
    { reactants: ["KMnO4","FeSO4","H2SO4"], products: ["K2SO4","MnSO4","Fe2(SO4)3","H2O"] },
    { reactants: ["K2Cr2O7","HCl"], products: ["KCl","CrCl3","H2O","Cl2"] },
    { reactants: ["K2Cr2O7","H2SO4","H2O2"], products: ["K2SO4","Cr2(SO4)3","O2","H2O"] },
    { reactants: ["K2Cr2O7","FeSO4","H2SO4"], products: ["K2SO4","Cr2(SO4)3","Fe2(SO4)3","H2O"] },
    { reactants: ["Na2O2","H2O"], products: ["NaOH","O2"] },
    { reactants: ["CaC2","N2"], products: ["CaCN2","C"] },
    { reactants: ["Ca3N2","H2O"], products: ["Ca(OH)2","NH3"] },
    { reactants: ["Mg3N2","H2O"], products: ["Mg(OH)2","NH3"] },
    { reactants: ["Li3N","H2O"], products: ["LiOH","NH3"] },
    { reactants: ["AlN","H2O"], products: ["Al(OH)3","NH3"] },
    { reactants: ["Si3N4","H2O"], products: ["H2SiO3","NH3"] },
    { reactants: ["PCl5","H2O"], products: ["H3PO4","HCl"] },
    { reactants: ["PCl3","H2O"], products: ["H3PO3","HCl"] },
    { reactants: ["P2O5","H2O"], products: ["H3PO4"] },
    { reactants: ["SO2Cl2","H2O"], products: ["H2SO4","HCl"] },
    { reactants: ["NOCl","H2O"], products: ["HNO2","HCl"] },
    { reactants: ["N2O4"], products: ["NO2"] },
    { reactants: ["N2O5"], products: ["NO2","O2"] },
    { reactants: ["HNO3"], products: ["NO2","H2O","O2"] },
    { reactants: ["H2SO4"], products: ["SO3","H2O"] },
    { reactants: ["NH4HCO3"], products: ["NH3","H2O","CO2"] },
    { reactants: ["(NH4)2CO3"], products: ["NH3","H2O","CO2"] },
    { reactants: ["NH4NO2"], products: ["N2","H2O"] },
    { reactants: ["Zn","H2SO4"], products: ["ZnSO4","H2"] },
    { reactants: ["Al","H2SO4"], products: ["Al2(SO4)3","H2"] },
    { reactants: ["Mg","H2SO4"], products: ["MgSO4","H2"] },
    { reactants: ["Fe","H2SO4"], products: ["FeSO4","H2"] },
    { reactants: ["C","H2O"], products: ["CO","H2"] },
    { reactants: ["CH4","H2O"], products: ["CO","H2"] },
    { reactants: ["CO","H2O"], products: ["CO2","H2"] },
    { reactants: ["C","CO2"], products: ["CO"] },
    { reactants: ["FeS","O2"], products: ["Fe2O3","SO2"] },
    { reactants: ["Cu2S","O2"], products: ["Cu2O","SO2"] },
    { reactants: ["ZnS","O2"], products: ["ZnO","SO2"] },
    { reactants: ["PbS","O2"], products: ["PbO","SO2"] },
    { reactants: ["HgS","O2"], products: ["HgO","SO2"] },
    { reactants: ["Sb2S3","O2"], products: ["Sb2O3","SO2"] },
    { reactants: ["As4S6","O2"], products: ["As4O6","SO2"] },
    { reactants: ["Na2S2O3","HCl"], products: ["NaCl","S","SO2","H2O"] },
    { reactants: ["KI","H2SO4"], products: ["K2SO4","I2","H2S","H2O"] },
    { reactants: ["Cr2O3","Al"], products: ["Al2O3","Cr"] },
    { reactants: ["Fe2O3","Al"], products: ["Al2O3","Fe"] },
    { reactants: ["MnO2","Al"], products: ["Al2O3","Mn"] },
    { reactants: ["CuO","Al"], products: ["Al2O3","Cu"] },
    { reactants: ["V2O5","Al"], products: ["Al2O3","V"] },
    { reactants: ["B2O3","Al"], products: ["Al2O3","B"] },
    { reactants: ["SiO2","Al"], products: ["Al2O3","Si"] },
    { reactants: ["TiO2","Al"], products: ["Al2O3","Ti"] },
    { reactants: ["WO3","Al"], products: ["Al2O3","W"] },
    { reactants: ["MoO3","Al"], products: ["Al2O3","Mo"] },
    { reactants: ["CrCl3","Al"], products: ["AlCl3","Cr"] },
    { reactants: ["FeCl3","Al"], products: ["AlCl3","Fe"] },
    { reactants: ["HNO3","Cu"], products: ["Cu(NO3)2","NO2","H2O"] },
    { reactants: ["HNO3","Ag"], products: ["AgNO3","NO","H2O"] },
    { reactants: ["HNO3","Fe"], products: ["Fe(NO3)3","NO","H2O"] },
    { reactants: ["HNO3","Zn"], products: ["Zn(NO3)2","N2","H2O"] },
    { reactants: ["HNO3","Al"], products: ["Al(NO3)3","NO","H2O"] },
    { reactants: ["HNO3","Mg"], products: ["Mg(NO3)2","N2O","H2O"] },
    { reactants: ["H2SO4","Cu"], products: ["CuSO4","SO2","H2O"] },
    { reactants: ["H2SO4","C"], products: ["CO2","SO2","H2O"] },
    { reactants: ["H2SO4","S"], products: ["SO2","H2O"] },
    { reactants: ["H2SO4","Fe"], products: ["Fe2(SO4)3","SO2","H2O"] },
    { reactants: ["C12H22O11","H2SO4"], products: ["C","SO2","H2O"] },
    { reactants: ["CuSO4","Fe"], products: ["FeSO4","Cu"] },
    { reactants: ["FeCl3","Fe"], products: ["FeCl2"] },
    { reactants: ["I2","Na2S2O3"], products: ["NaI","Na2S4O6"] },
    { reactants: ["Cl2","NaI"], products: ["NaCl","I2"] },
    { reactants: ["Br2","NaI"], products: ["NaBr","I2"] },
    { reactants: ["Cl2","NaBr"], products: ["NaCl","Br2"] },
    { reactants: ["F2","NaCl"], products: ["NaF","Cl2"] },
    { reactants: ["F2","NaBr"], products: ["NaF","Br2"] },
    { reactants: ["Si","NaOH","H2O"], products: ["Na2SiO3","H2"] },
    { reactants: ["Cl2","Ca(OH)2"], products: ["CaCl2","Ca(ClO)2","H2O"] },
    { reactants: ["SO2","Cl2","H2O"], products: ["H2SO4","HCl"] },
    { reactants: ["NH3","O2"], products: ["N2","H2O"] },
    { reactants: ["CH4","Cl2"], products: ["CCl4","HCl"] },
    { reactants: ["C2H6","Cl2"], products: ["C2H5Cl","HCl"] },
    { reactants: ["C6H6","HNO3"], products: ["C6H5NO2","H2O"] },
    { reactants: ["C2H5OH","Na"], products: ["C2H5ONa","H2"] }
];

function getRandomEquation() {
    return EQUATIONS_BANK[Math.floor(Math.random() * EQUATIONS_BANK.length)];
}

// --- CHEMICAL LOGIC ENGINE ---
const ChemParser = {
    // Advanced parser supporting parenthesis (e.g., Ca(OH)2)
    parseFormula(formula) {
        const atomCounts = {};
        const stack = [atomCounts];
        const regex = /([A-Z][a-z]*)(\d*)|(\()|(\))(\d*)/g;
        let match;

        while ((match = regex.exec(formula)) !== null) {
            const [full, element, count, open, close, multiplier] = match;
            const current = stack[stack.length - 1];

            if (element) {
                const n = parseInt(count) || 1;
                current[element] = (current[element] || 0) + n;
            } else if (open) {
                const subGroup = {};
                stack.push(subGroup);
            } else if (close) {
                const subGroup = stack.pop();
                const m = parseInt(multiplier) || 1;
                const parent = stack[stack.length - 1];
                for (let el in subGroup) {
                    parent[el] = (parent[el] || 0) + (subGroup[el] * m);
                }
            }
        }
        return atomCounts;
    },

    // Calculates the total atoms for one side (reactants or products)
    calculateSide(compounds, coefficients) {
        const sideTotals = {};
        compounds.forEach((formula, i) => {
            const coeff = coefficients[i] || 1;
            const atoms = this.parseFormula(formula);
            for (let el in atoms) {
                sideTotals[el] = (sideTotals[el] || 0) + (atoms[el] * coeff);
            }
        });
        return sideTotals;
    },

    // Main validation function
    validateEquation(reactants, products, userCoeffs) {
        const reactantCoeffs = userCoeffs.slice(0, reactants.length);
        const productCoeffs = userCoeffs.slice(reactants.length);

        const leftSide = this.calculateSide(reactants, reactantCoeffs);
        const rightSide = this.calculateSide(products, productCoeffs);

        const allElements = new Set([...Object.keys(leftSide), ...Object.keys(rightSide)]);
        const detail = {};
        let isCorrect = true;

        allElements.forEach(el => {
            const l = leftSide[el] || 0;
            const r = rightSide[el] || 0;
            detail[el] = { left: l, right: r };
            if (l !== r) isCorrect = false;
        });

        return { isCorrect, detail };
    }
};

// --- APP STATE ---

let playerName = "";
let myId = null;
let currentMatchId = null;
let currentEq = null;
let startTime = null;
let matchListener = null;

// --- UI ELEMENTS ---
const screens = {
    landing: document.getElementById('landing-screen'),
    matchmaking: document.getElementById('matchmaking-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen'),
    ranking: document.getElementById('ranking-screen'),
    store: document.getElementById('store-screen')
};

const showScreen = (id) => {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[id].classList.add('active');
    if (id === 'landing' || id === 'store') updateUIStats();
};

// --- USER DATA SYSTEM ---
let userData = {
    coins: 0,
    wins: 0,
    powers: { freeze: 0, confuse: 0 }
};

window.setPlayerFromAuth = (player) => {
    myId = player.userId;
    playerName = player.nickname;
    userData.coins = player.coins || 0;
    userData.wins = player.wins || 0;
    userData.powers = player.powers || { freeze: 0, confuse: 0 };
    
    // UI Transitions
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('landing-screen').classList.add('active');
    
    // Sync login name with game input
    const nameInput = document.getElementById('player-name');
    if (nameInput) {
        nameInput.value = playerName;
        nameInput.disabled = true;
        nameInput.style.opacity = "0.5";
    }

    // Update visuals
    updateUIStats();
};

async function initUser() {
    console.log("🎮 Iniciando motor del juego...");
    // Intentar recuperar sesión del usuario si existe
    if (window.Auth && typeof window.Auth.checkSession === 'function') {
        console.log("🔐 Verificando sesión activa...");
        window.Auth.checkSession();
    } else {
        console.warn("⚠️ Módulo de autenticación no detectado aún.");
    }
}

initUser();

function updateUIStats() {
    const coinEls = [document.getElementById('user-coins'), document.getElementById('store-coins')];
    coinEls.forEach(el => { if(el) el.innerText = "🪙 " + userData.coins });
    
    const fCount = document.getElementById('inventory-freeze');
    const cCount = document.getElementById('inventory-confuse');
    if (fCount) fCount.innerText = `Tienes: ${userData.powers.freeze}`;
    if (cCount) cCount.innerText = `Tienes: ${userData.powers.confuse}`;
}

async function saveUser() {
    if (!myId || myId.length < 10) return; // No guardar si es ID temporal o no existe
    try {
        const res = await fetch('/api/user/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: myId,
                coins: userData.coins,
                wins: userData.wins,
                powers: userData.powers
            })
        });
        const json = await res.json();
        if (json.success) {
            // Actualizar el "recuerdo" local para que al refrescar no se pierda nada
            const stored = JSON.parse(localStorage.getItem('_cb_user') || '{}');
            stored.coins = userData.coins;
            stored.wins = userData.wins;
            stored.powers = userData.powers;
            localStorage.setItem('_cb_user', JSON.stringify(stored));
            console.log("✅ Progreso guardado en nube y local");
        }
    } catch (e) {
        console.error("Error guardando usuario:", e);
    }
}

async function buyPower(type) {
    if (userData.coins >= 50) {
        userData.coins -= 50;
        userData.powers[type]++;
        await saveUser();
        updateUIStats();
    } else {
        alert("¡No tienes suficientes monedas! Gana más duelos.");
    }
}

document.getElementById('btn-show-store').onclick = () => showScreen('store');
document.getElementById('btn-back-store').onclick = () => showScreen('landing');
document.getElementById('buy-freeze').onclick = () => buyPower('freeze');
document.getElementById('buy-confuse').onclick = () => buyPower('confuse');
document.getElementById('btn-practice').onclick = () => startPractice();
document.getElementById('btn-ranking').onclick = () => loadRanking();
document.getElementById('btn-back-rank').onclick = () => showScreen('landing');
document.getElementById('btn-apply-rank').onclick = () => loadRanking();

async function loadRanking() {
    showScreen('ranking');
    const sortBy = document.getElementById('rank-sort').value; // 'wins' or 'coins'
    
    try {
        const res = await fetch(`/api/ranking?sort=${sortBy}`);
        const data = await res.json();
        const body = document.getElementById('ranking-body');
        body.innerHTML = "";

        if (data.success) {
            data.users.forEach((doc, i) => {
                const tr = document.createElement('tr');
                const posClass = i < 3 ? `pos-${i+1}` : "";
                
                // Mostrar Medallas para el Top 3, si no, el número
                let rankLabel = i + 1;
                if(i === 0) rankLabel = "🥇";
                else if(i === 1) rankLabel = "🥈";
                else if(i === 2) rankLabel = "🥉";

                tr.innerHTML = `
                    <td class="${posClass}">${rankLabel}</td>
                    <td style="text-align:left;">
                        <span style="display:block; font-weight:bold;">${doc.nickname}</span>
                        <span style="font-size:0.65rem; color:${doc.levelColor || '#fff'}; opacity:0.8;">${doc.levelEmoji} ${doc.levelName}</span>
                    </td>
                    <td style="font-size:0.8rem; opacity:0.8;">${doc.school || '---'}</td>
                    <td>${sortBy === 'wins' ? doc.wins + ' 🏆' : doc.coins + ' 🪙'}</td>
                `;
                body.appendChild(tr);
            });
        }
    } catch (e) {
        console.error("Error al cargar ranking:", e);
    }
}
let isPracticeMode = false;
let aiData = { time: 999, isCorrect: false };

function startPractice() {
    isPracticeMode = true;
    playerName = "Científico";
    showScreen('game');
    
    currentEq = getRandomEquation();
    renderEquation(currentEq);
    
    document.getElementById('rival-name').innerText = "Bot-Einstein";
    
    // Simulate AI
    const aiTime = 5 + Math.random() * 10;
    const aiSuccess = Math.random() < 0.7;
    
    setTimeout(() => {
        if (!isPracticeMode) return;
        aiData = { time: aiTime.toFixed(1), isCorrect: aiSuccess };
        if (aiSuccess && aiTime < parseFloat(responseTime)) {
            // AI won before player
            stopGame();
            showResults({ 
                winner_id: "AI", 
                winner_name: "Bot-Einstein", 
                time: aiTime.toFixed(1) 
            });
        }
    }, aiTime * 1000);
}

function stopGame() {
    if (precisionTimerInterval) clearInterval(precisionTimerInterval);
}

// Matchmaking Firebase Removido.
// Appwrite maneja esto desde appwrite-rooms.js

let responseTime = 0;
let precisionTimerInterval = null;

function renderEquation(eq) {
    const display = document.getElementById('equation-display');
    const inputsContainer = document.getElementById('coefficient-inputs');
    let eqHtml = "";
    
    eq.reactants.forEach((c, i) => {
        eqHtml += `<span class="unit"><span class="box-idx" data-idx="${i}">?</span>${c.replace(/(\d+)/g, '<sub>$1</sub>')}</span>`;
        if (i < eq.reactants.length - 1) eqHtml += " + ";
    });
    eqHtml += " → ";
    eq.products.forEach((c, i) => {
        const idx = eq.reactants.length + i;
        eqHtml += `<span class="unit"><span class="box-idx" data-idx="${idx}">?</span>${c.replace(/(\d+)/g, '<sub>$1</sub>')}</span>`;
        if (i < eq.products.length - 1) eqHtml += " + ";
    });
    display.innerHTML = eqHtml;
    inputsContainer.innerHTML = "";
    const total = eq.reactants.length + eq.products.length;
    for (let i = 0; i < total; i++) {
        const input = document.createElement('input');
        input.type = "number";
        input.className = "coeff-input";
        input.oninput = (e) => {
            const box = document.querySelector(`.box-idx[data-idx="${i}"]`);
            if (box) box.innerText = e.target.value || "?";
        };
        inputsContainer.appendChild(input);
    }

    // Start precision timer
    startTime = Date.now();
    precisionTimerInterval = setInterval(() => {
        responseTime = ((Date.now() - startTime) / 1000).toFixed(1);
        const timerEl = document.getElementById('timer-text');
        if (timerEl) timerEl.innerText = responseTime + "s";
    }, 100);
}

function startTimer() {
    // This is the global match 60s countdown (optional, kept for compatibility)
    let sek = 60;
    const timer = setInterval(() => {
        sek--;
        if (sek <= 0 || currentMatchId === null) clearInterval(timer);
    }, 1000);
}

window.setupMatchFromSocket = (eqIdx, rivalName) => {
    currentEq = EQUATIONS_BANK[eqIdx];
    
    showScreen('game');
    renderEquation(currentEq);
    
    document.getElementById('rival-name').innerText = rivalName;
};

async function submitAnswer() {
    const userCoeffs = Array.from(document.querySelectorAll('.coeff-input')).map(n => parseInt(n.value) || 1);
    const result = ChemParser.validateEquation(currentEq.reactants, currentEq.products, userCoeffs);
    const equationBox = document.querySelector('.equation-box');

    const timeFinal = parseFloat(responseTime);

    if (!result.isCorrect) {
        equationBox.classList.add('shake', 'incorrect');
        setTimeout(() => equationBox.classList.remove('shake', 'incorrect'), 600);
        return;
    }

    stopGame();
    equationBox.classList.add('correct');
    
    if (isPracticeMode) {
        let winnerId = myId;
        if (aiData.isCorrect && parseFloat(aiData.time) < timeFinal) winnerId = "AI";
        showResults({
            winner_id: winnerId,
            winner_name: winnerId === myId ? playerName : "Bot-Einstein",
            time: winnerId === myId ? timeFinal : aiData.time
        });
        return;
    }

    // --- ACTUALIZAR MATCH VIA SOCKET ---
    if (window.socket) {
        window.socket.emit('submit_answer', {
            userId: myId,
            nickname: playerName,
            time: timeFinal
        });
    }
}

function showResults(data) {
    if (precisionTimerInterval) clearInterval(precisionTimerInterval);
    showScreen('result');
    const isWinner = data.winner_id === myId;
    const title = document.getElementById('result-title');
    title.innerText = isWinner ? "¡VICTORIA!" : "OPONENTE GANÓ";
    title.style.color = isWinner ? "var(--neon-green)" : "var(--error-red)";
    document.getElementById('result-my-time').innerText = "Tiempo: " + data.time + "s";
    
    // --- SISTEMA DE RECOMPENSAS ---
    const rewardEl = document.createElement('div');
    rewardEl.id = "result-reward";
    rewardEl.style.marginTop = "15px";
    rewardEl.style.fontSize = "1.2rem";
    rewardEl.style.fontWeight = "bold";

    if (isWinner) {
        const oldLevel = getLevel(userData.wins);
        userData.coins += 10;
        userData.wins = (userData.wins || 0) + 1;
        const newLevel = getLevel(userData.wins);

        rewardEl.innerHTML = `<span style="color:var(--neon-green)">+10 🪙</span> | <span style="color:var(--neon-blue)">+1 PUNTO 🏆</span>`;

        // SI SUBIÓ DE NIVEL
        if (newLevel.name !== oldLevel.name) {
            const levelUpMsg = document.createElement('div');
            levelUpMsg.className = 'level-up-anim';
            levelUpMsg.style = `
                background: linear-gradient(45deg, #000, #222);
                border: 2px solid ${newLevel.color};
                padding: 15px;
                margin-top: 20px;
                border-radius: 10px;
                animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 0 30px ${newLevel.color}44;
            `;
            levelUpMsg.innerHTML = `
                <h2 style="color:${newLevel.color}; margin:0; font-size:1.1rem;">🧪 ¡ASCENSO CIENTÍFICO!</h2>
                <p style="margin:5px 0 0; font-size:0.9rem;">Ahora eres: <b>${newLevel.emoji} ${newLevel.name}</b></p>
            `;
            statsContainer.after(levelUpMsg);
        }
    } else {
        userData.coins = Math.max(0, userData.coins - 3);
        rewardEl.innerHTML = `<span style="color:var(--error-red)">-3 🪙</span> | <span style="color:white">0 PUNTOS</span>`;
    }
    
    // Insertar recompensa en la pantalla si no existe
    const statsContainer = document.querySelector('.result-stats');
    const oldReward = document.getElementById('result-reward');
    if (oldReward) oldReward.remove();
    statsContainer.after(rewardEl);
    
    updateUIStats();
    
    // Sync con API Local
    if (myId && !isPracticeMode) {
        saveUser();
    }

    // Limpieza al terminar la partida finalizada en Appwrite
    // TODO: Manejar eliminación de la partida de matchmaking_queue en backend o funciones si se requiere
}

// btn-play se adjunta en appwrite-rooms.js
document.getElementById('btn-submit').onclick = submitAnswer;
document.getElementById('btn-restart').onclick = () => location.reload();

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered!', reg))
            .catch(err => console.log('SW Registration Failed:', err));
    });
}
