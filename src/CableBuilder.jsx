import React, {useState} from 'react';

const unknown = 'Not sure — please advise';
const defaults = {fiber:'OS2 single-mode',end:'LC',polishA:'UPC',polishB:'UPC',count:'2 fibers — duplex',length:'1',boot:'Short boot',jacket:'OFNR / riser',construction:'Please advise',polarity:unknown,quantity:'1',destination:'',date:'',notes:''};
const choices = {
  fiber:['OS2 single-mode','OM1 multimode','OM2 multimode','OM3 multimode','OM4 multimode','OM5 multimode',unknown],
  end:['LC','SC',unknown],
  count:['1 fiber — simplex','2 fibers — duplex','4 fibers — individual LC/SC breakout',unknown],
  boot:['Short boot','Standard boot',unknown],
  jacket:['OFNR / riser','OFNP / plenum','LSZH — specify required fire rating in notes',unknown],
  construction:['Standard patch cable','Uniboot — two fibers in one cable','Please advise'],
  polarity:['A-to-B duplex crossover','A-to-A duplex straight-through',unknown],
};
export function formatRequirement(c) {
  return ['LC FIBER ASSEMBLY QUOTE REQUEST',
    `Fiber: ${c.fiber}`,`End A: LC ${c.polishA}`,`End B: ${c.end} / ${c.polishB}`,
    `Fiber count: ${c.count}`,`Length per assembly: ${c.length} m`,`Boot preference: ${c.boot}`,
    `Jacket / fire rating: ${c.jacket}`,`Construction: ${c.construction}`,`Polarity: ${c.count === '1 fiber — simplex' ? 'Not applicable — simplex' : c.polarity}`,
    `Quantity: ${c.quantity} assemblies`,`Destination: ${c.destination}`,`Target delivery date: ${c.date || 'Please advise'}`,
    `Additional requirements: ${c.notes || 'None supplied'}`,
    'Requested configuration only. Please confirm compatibility, availability, testing, pricing, and delivery in the quotation.'
  ].join('\n');
}
export default function CableBuilder({onQuote}) {
  const [c,setC] = useState(defaults);
  const multimode = c.fiber.includes('multimode');
  const unibootAvailable = c.end === 'LC' && c.count === '2 fibers — duplex';
  function update(key,value) {
    setC(previous => {
      const next = {...previous,[key]:value};
      if (key === 'count' && value !== '2 fibers — duplex') next.polarity = unknown;
      if (next.fiber.includes('multimode')) {
        if (next.polishA === 'APC') next.polishA = 'UPC';
        if (next.polishB === 'APC') next.polishB = 'UPC';
      }
      if ((next.end !== 'LC' || next.count !== '2 fibers — duplex') && next.construction.startsWith('Uniboot')) next.construction = 'Please advise';
      return next;
    });
  }
  function select(key,label,options=choices[key],hint) {
    return <label>{label}<select value={c[key]} onChange={e=>update(key,e.target.value)}>{options.map(value=><option key={value}>{value}</option>)}</select>{hint && <small>{hint}</small>}</label>;
  }
  const polishOptions = multimode ? ['UPC',unknown] : ['UPC','APC',unknown];
  return <main className="builder-page section">
    <a className="builder-back" href="/#products">← LC fiber assemblies</a>
    <div className="eyebrow">YOUR REQUIREMENT, ASSEMBLED</div>
    <h1>Build your<br/><em>LC fiber quote.</em></h1>
    <p className="builder-intro">Choose your cable specifications. We’ll review your requirement and confirm the details before quoting. Unsure about a field? Choose “please advise” or add a note.</p>
    <form className="builder-layout" onSubmit={e=>{e.preventDefault();onQuote(formatRequirement(c));}}>
      <div className="builder-fields">
        <fieldset><legend><span>01</span> Fiber & connections</legend><div className="builder-grid">
          {select('fiber','Fiber category')}
          {select('count','Fiber count')}
        </div><div className="builder-grid builder-ends">
          <div className="builder-end"><h3>End A</h3>
            <label>End A connector<input value="LC" readOnly aria-describedby="lc-fixed-help"/></label>
            <small id="lc-fixed-help">Fixed to LC for this builder.</small>
            {select('polishA','End A polish',polishOptions)}
          </div>
          <div className="builder-end"><h3>End B</h3>
            {select('end','End B connector')}
            <small>Choose the connector for the other end.</small>
            {select('polishB','End B polish',polishOptions)}
          </div>
        </div><p className="builder-help">Match each connector and polish to its mating port. UPC and APC must not mate directly. A cable can have different polish types at opposite ends when each matches its own port.</p></fieldset>
        <fieldset><legend><span>02</span> Cable details</legend><div className="builder-grid">
          <label>Length per assembly (metres)<input type="number" min="0.1" max="10000" step="0.1" required value={c.length} onChange={e=>update('length',e.target.value)}/></label>
          {select('boot','Boot preference')}
          {select('jacket','Jacket / fire rating')}
          {select('construction','Construction',choices.construction.filter(v=>unibootAvailable || !v.startsWith('Uniboot')))}
          {c.count !== '1 fiber — simplex' && select('polarity','Polarity',c.count === '2 fibers — duplex' ? choices.polarity : [unknown])}
        </div><p className="builder-help">LSZH is not a substitute for a required fire rating. For four fibers, specify connector grouping and strand mapping in your notes. Cable diameter, bend radius, and test requirements can also be added below.</p></fieldset>
        <fieldset><legend><span>03</span> Quantity & delivery</legend><div className="builder-grid">
          <label>Quantity (complete assemblies)<input type="number" min="1" max="1000000" step="1" required value={c.quantity} onChange={e=>update('quantity',e.target.value)}/></label>
          <label>Delivery destination<input required maxLength={200} placeholder="City, country / postal code" value={c.destination} onChange={e=>update('destination',e.target.value)}/></label>
          <label>Target delivery date (optional)<input type="date" value={c.date} onChange={e=>update('date',e.target.value)}/></label>
        </div><label>Notes / help with specifications<textarea maxLength={4000} value={c.notes} onChange={e=>update('notes',e.target.value)} placeholder="Equipment / optic part numbers, cable diameter, test reports, custom lengths, or anything you need help choosing…"/></label></fieldset>
      </div>
      <aside className="builder-summary" aria-labelledby="summary-heading"><div className="eyebrow">READY FOR REVIEW</div><h2 id="summary-heading">Your cable brief.</h2><img src="/images/lc-duplex-concept-v2.png" alt="Illustrative LC duplex cable; not a preview of your selections"/><dl>
        {[['Fiber',c.fiber],['End A',`LC / ${c.polishA}`],['End B',`${c.end} / ${c.polishB}`],['Fibers',c.count],['Length',`${c.length || '—'} m`],['Boot',c.boot],['Jacket',c.jacket],['Construction',c.construction],['Polarity',c.count === '1 fiber — simplex' ? 'Not applicable' : c.polarity],['Quantity',`${c.quantity || '—'} assemblies`]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl><button className="lime-btn" type="submit">Continue to quote request ↗</button><p>No payment or order commitment. Your selections will be included in the inquiry. Availability, compatibility, pricing, and delivery are confirmed per quotation.</p><small>Illustration is conceptual.</small></aside>
    </form>
  </main>;
}
