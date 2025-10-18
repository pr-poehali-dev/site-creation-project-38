import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Креативная керамическая ваза', price: 4500, category: 'Декор', image: 'https://cdn.poehali.dev/projects/63496fd0-184e-417f-a7c4-2aa3f5dcb1c9/files/8537f9f3-ada9-4634-a0a3-9fffd438deea.jpg', description: 'Уникальная ваза ручной работы' },
  { id: 2, name: 'Дизайнерский светильник', price: 8900, category: 'Освещение', image: 'https://cdn.poehali.dev/projects/63496fd0-184e-417f-a7c4-2aa3f5dcb1c9/files/51fae5ce-7d2e-4110-ba51-5fc0150d80dd.jpg', description: 'Современный настольный светильник' },
  { id: 3, name: 'Художественный постер', price: 2300, category: 'Искусство', image: 'https://cdn.poehali.dev/projects/63496fd0-184e-417f-a7c4-2aa3f5dcb1c9/files/8d3f6ae6-260f-4b47-8f10-2402540f3117.jpg', description: 'Лимитированная серия постеров' },
  { id: 4, name: 'Эко-подушка из льна', price: 3200, category: 'Текстиль', image: '/placeholder.svg', description: 'Натуральный лён премиум качества' },
  { id: 5, name: 'Минималистичные часы', price: 6700, category: 'Аксессуары', image: '/placeholder.svg', description: 'Настенные часы в скандинавском стиле' },
  { id: 6, name: 'Арт-свечи набор', price: 1800, category: 'Декор', image: '/placeholder.svg', description: 'Набор из 3 ароматических свечей' },
];

const Index = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');

  const categories = ['Все', ...Array.from(new Set(products.map(p => p.category)))];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      );
      return updated.filter(item => item.quantity > 0);
    });
  };

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Sparkles" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CreativeShop
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#catalog" className="text-foreground/80 hover:text-primary transition-colors font-medium">Каталог</a>
              <a href="#about" className="text-foreground/80 hover:text-primary transition-colors font-medium">О нас</a>
              <a href="#contacts" className="text-foreground/80 hover:text-primary transition-colors font-medium">Контакты</a>
            </nav>

            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Icon name="Heart" size={20} />
                    {favorites.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-secondary">
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Icon name="Heart" className="text-secondary" />
                      Избранное
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {favoriteProducts.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Пока нет избранных товаров</p>
                    ) : (
                      favoriteProducts.map(product => (
                        <Card key={product.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4 flex gap-4">
                            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-lg font-bold text-primary mt-1">{product.price} ₽</p>
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => toggleFavorite(product.id)}
                            >
                              <Icon name="X" size={18} />
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-accent">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Icon name="ShoppingCart" className="text-accent" />
                      Корзина
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
                    {cart.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                    ) : (
                      cart.map(item => (
                        <Card key={item.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                              <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{item.price} ₽</p>
                                <div className="flex items-center gap-3 mt-3">
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="font-semibold w-8 text-center">{item.quantity}</span>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary">{item.price * item.quantity} ₽</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                  {cart.length > 0 && (
                    <div className="border-t pt-4 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Итого:</span>
                        <span className="text-2xl font-bold text-primary">{cartTotal} ₽</span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity" size="lg">
                        Оформить заказ
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Креативные товары для вашего дома
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Уникальные дизайнерские вещи, созданные с любовью и вниманием к деталям
            </p>
          </div>

          <div id="catalog" className="mb-12 flex flex-wrap gap-3 justify-center animate-slide-up">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat 
                  ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                  : "hover:border-primary"}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-scale-in border-2 hover:border-primary/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4 rounded-full shadow-lg"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Icon 
                      name="Heart" 
                      size={20} 
                      className={favorites.includes(product.id) ? "fill-current text-secondary" : ""} 
                    />
                  </Button>
                  <Badge className="absolute top-4 left-4 bg-white/90 text-foreground border-0">
                    {product.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {product.price} ₽
                    </span>
                    <Button 
                      onClick={() => addToCart(product)}
                      className="bg-gradient-to-r from-accent to-secondary hover:opacity-90 transition-opacity"
                    >
                      <Icon name="ShoppingBag" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            О нас
          </h2>
          <p className="text-lg text-foreground/80 leading-relaxed mb-8">
            CreativeShop — это место, где встречаются талант и вкус. Мы тщательно отбираем каждый товар, 
            работая напрямую с дизайнерами и мастерами. Наша миссия — делать качественный дизайн доступным 
            и помогать вам создавать уникальные интерьеры.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
              <Icon name="Award" size={40} className="mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-xl mb-2">Качество</h3>
              <p className="text-foreground/70">Только проверенные производители</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-accent/10">
              <Icon name="Palette" size={40} className="mx-auto mb-4 text-secondary" />
              <h3 className="font-bold text-xl mb-2">Уникальность</h3>
              <p className="text-foreground/70">Эксклюзивные дизайнерские вещи</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10">
              <Icon name="Truck" size={40} className="mx-auto mb-4 text-accent" />
              <h3 className="font-bold text-xl mb-2">Доставка</h3>
              <p className="text-foreground/70">Быстро и аккуратно по всей России</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Контакты
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 text-lg">
              <Icon name="Mail" className="text-primary" />
              <a href="mailto:hello@creativeshop.ru" className="hover:text-primary transition-colors">
                hello@creativeshop.ru
              </a>
            </div>
            <div className="flex items-center justify-center gap-3 text-lg">
              <Icon name="Phone" className="text-secondary" />
              <a href="tel:+79991234567" className="hover:text-primary transition-colors">
                +7 (999) 123-45-67
              </a>
            </div>
            <div className="flex items-center justify-center gap-3 text-lg">
              <Icon name="MapPin" className="text-accent" />
              <span>Москва, ул. Дизайнерская, 42</span>
            </div>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button size="icon" variant="outline" className="rounded-full hover:bg-primary hover:text-white">
                <Icon name="Instagram" size={20} />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full hover:bg-primary hover:text-white">
                <Icon name="Facebook" size={20} />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full hover:bg-primary hover:text-white">
                <Icon name="Twitter" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-primary to-secondary text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-white/90">© 2024 CreativeShop. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;