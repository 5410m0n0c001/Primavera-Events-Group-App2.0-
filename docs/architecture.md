\# Arquitectura General – Primavera Events Group



\## Visión de Alto Nivel



```text

\[ UI / React ]

&nbsp;    |

&nbsp;    |  (State updates)

&nbsp;    v

\[ Wizard.tsx ]

&nbsp;    |

&nbsp;    |  useMemo (Derived Calculations)

&nbsp;    v

\[ QuoteDraft + Totals ]

&nbsp;    |

&nbsp;    |  Props

&nbsp;    v

\[ QuoteBreakdown (Sticky Sidebar) ]

&nbsp;    |

&nbsp;    |  Final validation

&nbsp;    v

\[ Backend API ]

&nbsp;    |

&nbsp;    |  Recalculate (Source of Truth)

&nbsp;    v

\[ PDF Generator ]



