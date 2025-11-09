import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  getAllProductsAdmin,
  createProduct,
  updateProductAdmin,
  deleteProductAdmin
} from '../../services/productService'

const emptyForm = {
  name: '',
  sku: '',
  description: '',
  price: '',
  originalPrice: '',
  category: 'mujer',
  image: '',
  images: [],
  sizes: [],
  colors: [],
  badge: '',
  featured: false,
  onSale: false,
  variants: [],
  details: {
    materials: '',
    care: '',
    features: [],
    fit: ''
  },
  active: true
}

const ProductsAdmin = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [sizesDraft, setSizesDraft] = useState('')
  const [colorsDraft, setColorsDraft] = useState('')
  // Filtros
  const [statusFilter, setStatusFilter] = useState('all') // all|active|inactive
  const [categoryFilter, setCategoryFilter] = useState('all') // all|mujer|hombre|accesorios
  const [sortBy, setSortBy] = useState('createdAtDesc') // createdAtDesc|priceAsc|priceDesc|nameAsc|nameDesc
  const [query, setQuery] = useState('')

  const title = useMemo(() => editingId ? 'Editar producto' : 'Crear producto', [editingId])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
  const data = await getAllProductsAdmin()
      setProducts(data)
    } catch (e) {
      setError(e.response?.data?.message || 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('details.')) {
      const key = name.split('.')[1]
      setForm(prev => ({ ...prev, details: { ...prev.details, [key]: value } }))
      return
    }
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const parseList = (text) => (text || '').split(',').map(s => s.trim()).filter(Boolean)

  const sizesText = useMemo(() => (form.sizes || []).join(','), [form.sizes])
  const colorsText = useMemo(() => (form.colors || []).join(','), [form.colors])
  const featuresText = useMemo(() => (form.details?.features || []).join(' | '), [form.details])

  // Mantener drafts sincronizados con el formulario cuando cambien desde fuera
  useEffect(() => { setSizesDraft((form.sizes || []).join(',')) }, [form.sizes])
  useEffect(() => { setColorsDraft((form.colors || []).join(',')) }, [form.colors])

  // Derivar lista filtrada/ordenada
  const filteredProducts = useMemo(() => {
    let list = [...(products || [])]
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active'
      list = list.filter(p => (p.active !== false) === isActive)
    }
    if (categoryFilter !== 'all') {
      list = list.filter(p => p.category === categoryFilter)
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q)
      )
    }
    switch (sortBy) {
      case 'priceAsc': list.sort((a,b)=>(a.price||0)-(b.price||0)); break
      case 'priceDesc': list.sort((a,b)=>(b.price||0)-(a.price||0)); break
      case 'nameAsc': list.sort((a,b)=> (a.name||'').localeCompare(b.name||'')); break
      case 'nameDesc': list.sort((a,b)=> (b.name||'').localeCompare(a.name||'')); break
      default: // createdAtDesc
        list.sort((a,b)=> new Date(b.createdAt||0) - new Date(a.createdAt||0))
    }
    return list
  }, [products, statusFilter, categoryFilter, sortBy, query])

  const handleSetSizes = (text) => setForm(p => ({ ...p, sizes: parseList(text) }))
  const handleSetColors = (text) => setForm(p => ({ ...p, colors: parseList(text) }))
  const handleSetFeatures = (text) => setForm(p => ({ ...p, details: { ...p.details, features: text.split('|').map(s=>s.trim()).filter(Boolean) } }))

  // Variants editor helpers
  const addVariant = () => setForm(p => ({ ...p, variants: [...(p.variants||[]), { size: '', color: '', stock: 0, sku: '' }] }))
  const updateVariant = (idx, key, value) => setForm(p => ({ ...p, variants: p.variants.map((v,i)=> i===idx ? { ...v, [key]: key==='stock'? Number(value||0): value } : v) }))
  const removeVariant = (idx) => setForm(p => ({ ...p, variants: p.variants.filter((_,i)=> i!==idx) }))

  const startCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setSuccess('')
  }
  const startEdit = (p) => {
    setEditingId(p._id)
    setForm({
      name: p.name || '',
      sku: p.sku || '',
      description: p.description || '',
      price: p.price || '',
      originalPrice: p.originalPrice || '',
      category: p.category || 'mujer',
      image: p.image || '',
      images: p.images || [],
      sizes: p.sizes || [],
      colors: p.colors || [],
      badge: p.badge || '',
      featured: !!p.featured,
      onSale: !!p.onSale,
      variants: p.variants || [],
      details: {
        materials: p.details?.materials || '',
        care: p.details?.care || '',
        features: p.details?.features || [],
        fit: p.details?.fit || ''
      },
      active: p.active !== false
    })
    setError('')
    setSuccess('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      // Asegurar que se apliquen los drafts al guardar
      const sizesArr = parseList(sizesDraft)
      const colorsArr = parseList(colorsDraft)
      const allowed = new Set()
      sizesArr.forEach(s => colorsArr.forEach(c => allowed.add(`${s}__${c}`)))
      const variantsFiltered = (form.variants || []).filter(v => allowed.has(`${v.size}__${v.color}`))

      const payload = {
        ...form,
        sizes: sizesArr,
        colors: colorsArr,
        variants: variantsFiltered,
        price: Number(form.price || 0),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined
      }
      const saved = editingId
        ? await updateProductAdmin(editingId, payload)
        : await createProduct(payload)
      setSuccess('Producto guardado correctamente')
      await load()
      if (!editingId) setForm(emptyForm)
    } catch (e) {
      setError(e.response?.data?.message || 'Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await deleteProductAdmin(id)
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Error al eliminar')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Administración de Productos</h1>
          <button onClick={startCreate} className="btn btn-primary">
            <i className="fas fa-plus mr-2"/> Nuevo producto
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs text-gray-600">Estado</label>
            <select className="input" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600">Categoría</label>
            <select className="input" value={categoryFilter} onChange={(e)=>setCategoryFilter(e.target.value)}>
              <option value="all">Todas</option>
              <option value="mujer">Mujer</option>
              <option value="hombre">Hombre</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600">Ordenar por</label>
            <select className="input" value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
              <option value="createdAtDesc">Más recientes</option>
              <option value="priceAsc">Precio ↑</option>
              <option value="priceDesc">Precio ↓</option>
              <option value="nameAsc">Nombre A-Z</option>
              <option value="nameDesc">Nombre Z-A</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600">Buscar (nombre o SKU)</label>
            <input className="input" placeholder="Buscar..." value={query} onChange={(e)=>setQuery(e.target.value)} />
          </div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List */}
          <div className="lg:col-span-2 bg-white rounded shadow p-4 overflow-x-auto">
            {loading ? (
              <div className="py-10 text-center text-gray-500">Cargando...</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-2">Nombre</th>
                    <th className="py-2 pr-2">SKU</th>
                    <th className="py-2 pr-2">Categoría</th>
                    <th className="py-2 pr-2">Precio</th>
                    <th className="py-2 pr-2">Estado</th>
                    <th className="py-2 pr-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p._id} className="border-b">
                      <td className="py-2 pr-2">{p.name}</td>
                      <td className="py-2 pr-2 font-mono text-xs text-gray-600">{p.sku || '-'}</td>
                      <td className="py-2 pr-2 capitalize">{p.category}</td>
                      <td className="py-2 pr-2">${(p.price||0).toLocaleString('es-CO')}</td>
                      <td className="py-2 pr-2">{p.active !== false ? 'Activo' : 'Inactivo'}</td>
                      <td className="py-2 pr-2 text-right">
                        <button onClick={()=>startEdit(p)} className="text-primary hover:underline mr-3">
                          Editar
                        </button>
                        <button onClick={()=>handleDelete(p._id)} className="text-red-600 hover:underline">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Form */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input name="name" value={form.name} onChange={handleInput} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium">SKU del producto</label>
                <input name="sku" value={form.sku} onChange={handleInput} className="input font-mono" placeholder="p.ej. MUJ-VEST-0001" />
              </div>
              <div>
                <label className="block text-sm font-medium">Descripción</label>
                <textarea name="description" value={form.description} onChange={handleInput} className="input" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Precio</label>
                  <input name="price" type="number" value={form.price} onChange={handleInput} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium">Precio Original</label>
                  <input
                    name="originalPrice"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={form.originalPrice}
                    onChange={handleInput}
                    placeholder="(opcional)"
                    className="input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Categoría</label>
                  <select name="category" value={form.category} onChange={handleInput} className="input">
                    <option value="mujer">Mujer</option>
                    <option value="hombre">Hombre</option>
                    <option value="accesorios">Accesorios</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Badge</label>
                  <select name="badge" value={form.badge} onChange={handleInput} className="input">
                    <option value="">(Ninguno)</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Trending">Trending</option>
                    <option value="Oferta">Oferta</option>
                  </select>
                </div>
              </div>
              {/* Images Manager */}
              <div>
                <label className="block text-sm font-medium">Imagen principal (URL)</label>
                <input name="image" value={form.image} onChange={handleInput} className="input" />
                <div className="mt-3">
                  <label className="block text-sm font-medium">Galería de imágenes (URLs)</label>
                  <ImagesManager form={form} setForm={setForm} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Tallas (separadas por coma)</label>
                  <input value={sizesDraft} onChange={(e)=>setSizesDraft(e.target.value)} onBlur={()=>handleSetSizes(sizesDraft)} className="input" placeholder="S,M,L,XL" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Colores (separados por coma)</label>
                  <input value={colorsDraft} onChange={(e)=>setColorsDraft(e.target.value)} onBlur={()=>handleSetColors(colorsDraft)} className="input" placeholder="Negro,Blanco" />
                </div>
              </div>

              {/* Variants - Visual Matrix Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Variantes</label>
                  <div className="flex items-center gap-3 text-sm">
                    <button type="button" onClick={addVariant} className="text-primary hover:underline">Añadir fila manual</button>
                    <button
                      type="button"
                      onClick={() => {
                        const sizes = parseList(sizesDraft)
                        const colors = parseList(colorsDraft)
                        setForm(p => {
                          const next = { ...p, sizes, colors }
                          const exists = new Set((next.variants||[]).map(v => `${v.size}__${v.color}`))
                          const all = [...(next.variants||[])]
                          sizes.forEach(s => colors.forEach(c => {
                            const key = `${s}__${c}`
                            if (!exists.has(key)) all.push({ size: s, color: c, stock: 0, sku: '' })
                          }))
                          next.variants = all
                          return next
                        })
                      }}
                      className="text-primary hover:underline"
                    >
                      Generar todas
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, variants: [] }))}
                      className="text-red-600 hover:underline"
                    >
                      Borrar todas
                    </button>
                  </div>
                </div>
                <VariantsMatrix
                  sizes={form.sizes || []}
                  colors={form.colors || []}
                  variants={form.variants || []}
                  onChange={(newVariants) => setForm(p => ({ ...p, variants: newVariants }))}
                />
                {/* Editor de filas manuales como respaldo */}
                {(form.variants||[]).length > 0 && (
                  <div className="mt-3 space-y-2">
                    {(form.variants||[]).map((v, idx)=>(
                      <div key={`${v.size}-${v.color}-${idx}`} className="grid grid-cols-5 gap-2 items-end">
                        <input className="input" placeholder="Talla" value={v.size} onChange={(e)=>updateVariant(idx,'size',e.target.value)} />
                        <input className="input" placeholder="Color" value={v.color} onChange={(e)=>updateVariant(idx,'color',e.target.value)} />
                        <input className="input" type="number" placeholder="Stock" value={v.stock} onChange={(e)=>updateVariant(idx,'stock',e.target.value)} />
                        <input className="input" placeholder="SKU" value={v.sku||''} onChange={(e)=>updateVariant(idx,'sku',e.target.value)} />
                        <button type="button" onClick={()=>removeVariant(idx)} className="text-red-600 hover:underline text-sm">Quitar</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="border-t pt-3 mt-3">
                <label className="block text-sm font-medium">Detalles</label>
                <div className="space-y-2 mt-2">
                  <input className="input" name="details.materials" value={form.details.materials} onChange={handleInput} placeholder="Materiales" />
                  <input className="input" name="details.care" value={form.details.care} onChange={handleInput} placeholder="Cuidados" />
                  <input className="input" value={featuresText} onChange={(e)=>handleSetFeatures(e.target.value)} placeholder="Características separadas por |" />
                  <input className="input" name="details.fit" value={form.details.fit} onChange={handleInput} placeholder="Ajuste (fit)" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="featured" checked={!!form.featured} onChange={handleInput} /> Destacado
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="onSale" checked={!!form.onSale} onChange={handleInput} /> En oferta
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="active" checked={form.active !== false} onChange={handleInput} /> Activo
                </label>
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary w-full disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Tailwind utility for input */}
      <style>{`.input{width:100%;padding:.6rem .75rem;border:1px solid #e5e7eb;border-radius:.375rem}
      .thumb-btn{position:absolute;top:.25rem;right:.25rem;background:rgba(17,24,39,.7);color:#fff;border-radius:.375rem;padding:.15rem .4rem;font-size:.75rem}
      `}</style>
    </div>
  )
}

export default ProductsAdmin

// Subcomponentes: ImagesManager y VariantsMatrix
const ImagesManager = ({ form, setForm }) => {
  const [newUrl, setNewUrl] = useState('')

  const addImage = () => {
    const url = newUrl.trim()
    if (!url) return
    setForm(p => ({ ...p, images: [...(p.images||[]), url] }))
    if (!form.image) setForm(p => ({ ...p, image: url }))
    setNewUrl('')
  }

  const removeAt = (idx) => {
    setForm(p => {
      const next = { ...p }
      const arr = [...(next.images||[])]
      const removed = arr.splice(idx,1)[0]
      next.images = arr
      if (next.image === removed) {
        next.image = arr[0] || ''
      }
      return next
    })
  }

  const makePrimary = (idx) => {
    setForm(p => {
      const next = { ...p }
      const arr = [...(next.images||[])]
      const [img] = arr.splice(idx,1)
      next.images = [img, ...arr]
      next.image = img
      return next
    })
  }

  const move = (idx, dir) => {
    setForm(p => {
      const next = { ...p }
      const arr = [...(next.images||[])]
      const j = idx + dir
      if (j < 0 || j >= arr.length) return next
      const tmp = arr[idx]
      arr[idx] = arr[j]
      arr[j] = tmp
      next.images = arr
      next.image = arr[0] || next.image
      return next
    })
  }

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <input className="input flex-1" placeholder="https://..." value={newUrl} onChange={(e)=>setNewUrl(e.target.value)} />
        <button type="button" onClick={addImage} className="btn btn-primary">Agregar</button>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {(form.images||[]).map((url, idx) => (
          <div key={url+idx} className="relative border rounded overflow-hidden">
            <img src={url} alt="img" className="w-full h-24 object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 bg-black/40 text-white text-xs">
              <button type="button" onClick={()=>makePrimary(idx)} className="underline">{idx===0? 'Principal' : 'Hacer principal'}</button>
              <div className="flex gap-2">
                <button type="button" onClick={()=>move(idx,-1)} disabled={idx===0} className="disabled:opacity-40">↑</button>
                <button type="button" onClick={()=>move(idx,1)} disabled={idx===(form.images.length-1)} className="disabled:opacity-40">↓</button>
                <button type="button" onClick={()=>removeAt(idx)} className="text-red-300">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const colorMap = {
  'Negro': '#000000',
  'Blanco': '#FFFFFF',
  'Gris': '#808080',
  'Azul': '#1E40AF',
  'Rojo': '#DC2626',
  'Verde': '#059669',
  'Amarillo': '#FBBF24',
  'Naranja': '#F97316',
  'Rosa': '#EC4899',
  'Morado': '#9333EA',
  'Beige': '#D4B896',
  'Café': '#7C3416',
  'Vino': '#722F37',
  'Dorado': '#FFD700',
  'Plateado': '#C0C0C0'
}

const VariantsMatrix = ({ sizes, colors, variants, onChange }) => {
  // Construir mapa de acceso rápido
  const map = useMemo(() => {
    const m = new Map()
    ;(variants||[]).forEach(v => m.set(`${v.size}__${v.color}`, v))
    return m
  }, [variants])

  const toggleCell = (size, color) => {
    const key = `${size}__${color}`
    const exists = map.get(key)
    if (exists) {
      onChange(variants.filter(v => !(v.size===size && v.color===color)))
    } else {
      onChange([...(variants||[]), { size, color, stock: 0, sku: '' }])
    }
  }

  const updateCell = (size, color, field, value) => {
    const next = (variants||[]).map(v => {
      if (v.size===size && v.color===color) {
        return { ...v, [field]: field==='stock' ? Number(value||0) : value }
      }
      return v
    })
    onChange(next)
  }

  // Si se remueven tallas/colores, depurar variantes
  useEffect(() => {
    const allowed = new Set()
    sizes.forEach(s => colors.forEach(c => allowed.add(`${s}__${c}`)))
    const filtered = (variants||[]).filter(v => allowed.has(`${v.size}__${v.color}`))
    if (filtered.length !== (variants||[]).length) onChange(filtered)
  }, [sizes.join(','), colors.join(',')])

  if (!sizes.length || !colors.length) {
    return <div className="text-sm text-gray-500">Agrega tallas y colores para habilitar la matriz de variantes.</div>
  }

  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 border-r bg-gray-50">Talla \\ Color</th>
            {colors.map(c => (
              <th key={c} className="p-2 border-r bg-gray-50">
                <div className="flex items-center gap-2 justify-center">
                  <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: colorMap[c] || '#e5e7eb', border: '1px solid #d1d5db' }} />
                  <span className="capitalize">{c}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sizes.map(size => (
            <tr key={size}>
              <td className="p-2 border-r font-medium text-center">{size}</td>
              {colors.map(color => {
                const key = `${size}__${color}`
                const v = map.get(key)
                const active = !!v
                return (
                  <td key={key} className={`p-2 border-r align-top ${active? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="flex flex-col items-stretch gap-1">
                      <label className="inline-flex items-center gap-2 text-xs">
                        <input type="checkbox" checked={active} onChange={() => toggleCell(size,color)} /> Habilitar
                      </label>
                      {active && (
                        <div className="grid grid-cols-2 gap-2">
                          <input className="input" type="number" min="0" placeholder="Stock" value={v.stock}
                            onChange={(e)=>updateCell(size,color,'stock',e.target.value)} />
                          <input className="input" placeholder="SKU" value={v.sku||''}
                            onChange={(e)=>updateCell(size,color,'sku',e.target.value)} />
                        </div>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
